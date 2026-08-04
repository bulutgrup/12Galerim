#!/usr/bin/env python3
"""
ELF 16KB Page Alignment Patcher

Patches ELF shared libraries to support 16KB page sizes by:
1. Adjusting PT_LOAD segment p_align to 16KB (0x4000)
2. Re-aligning segment file offsets so that p_offset % 0x4000 == p_vaddr % 0x4000
3. Inserting padding between segments and updating all offset references

This is necessary for Android 15+ / Google Play's 16KB page size requirement
when using precompiled native libraries that were built with 4KB alignment.
"""

import os
import struct
import sys

PAGE_SIZE_16KB = 0x4000
PT_LOAD = 1


def parse_elf_header(data):
    if len(data) < 64 or data[0:4] != b'\x7fELF':
        return None

    ei_class = data[4]
    ei_data = data[5]
    is_64 = (ei_class == 2)
    endian = '<' if ei_data == 1 else '>'

    if is_64:
        return {
            'is_64': True, 'endian': endian,
            'e_phoff': struct.unpack_from(endian + 'Q', data, 32)[0],
            'e_shoff': struct.unpack_from(endian + 'Q', data, 40)[0],
            'e_phentsize': struct.unpack_from(endian + 'H', data, 54)[0],
            'e_phnum': struct.unpack_from(endian + 'H', data, 56)[0],
            'e_shentsize': struct.unpack_from(endian + 'H', data, 58)[0],
            'e_shnum': struct.unpack_from(endian + 'H', data, 60)[0],
        }
    else:
        return {
            'is_64': False, 'endian': endian,
            'e_phoff': struct.unpack_from(endian + 'I', data, 28)[0],
            'e_shoff': struct.unpack_from(endian + 'I', data, 32)[0],
            'e_phentsize': struct.unpack_from(endian + 'H', data, 42)[0],
            'e_phnum': struct.unpack_from(endian + 'H', data, 44)[0],
            'e_shentsize': struct.unpack_from(endian + 'H', data, 46)[0],
            'e_shnum': struct.unpack_from(endian + 'H', data, 48)[0],
        }


def parse_phdr(data, offset, is_64, endian):
    if is_64:
        return {
            'p_type':   struct.unpack_from(endian + 'I', data, offset)[0],
            'p_flags':  struct.unpack_from(endian + 'I', data, offset + 4)[0],
            'p_offset': struct.unpack_from(endian + 'Q', data, offset + 8)[0],
            'p_vaddr':  struct.unpack_from(endian + 'Q', data, offset + 16)[0],
            'p_paddr':  struct.unpack_from(endian + 'Q', data, offset + 24)[0],
            'p_filesz': struct.unpack_from(endian + 'Q', data, offset + 32)[0],
            'p_memsz':  struct.unpack_from(endian + 'Q', data, offset + 40)[0],
            'p_align':  struct.unpack_from(endian + 'Q', data, offset + 48)[0],
        }
    else:
        return {
            'p_type':   struct.unpack_from(endian + 'I', data, offset)[0],
            'p_offset': struct.unpack_from(endian + 'I', data, offset + 4)[0],
            'p_vaddr':  struct.unpack_from(endian + 'I', data, offset + 8)[0],
            'p_paddr':  struct.unpack_from(endian + 'I', data, offset + 12)[0],
            'p_filesz': struct.unpack_from(endian + 'I', data, offset + 16)[0],
            'p_memsz':  struct.unpack_from(endian + 'I', data, offset + 20)[0],
            'p_flags':  struct.unpack_from(endian + 'I', data, offset + 24)[0],
            'p_align':  struct.unpack_from(endian + 'I', data, offset + 28)[0],
        }


def realign_elf_16kb(filepath):
    """Patch a single ELF file for 16KB page alignment. Returns True if patched."""
    with open(filepath, 'rb') as f:
        data = bytearray(f.read())

    hdr = parse_elf_header(data)
    if hdr is None:
        return False

    is_64 = hdr['is_64']
    endian = hdr['endian']
    e_phoff = hdr['e_phoff']
    e_shoff = hdr['e_shoff']
    e_phentsize = hdr['e_phentsize']
    e_phnum = hdr['e_phnum']
    e_shentsize = hdr['e_shentsize']
    e_shnum = hdr['e_shnum']

    # Parse all program headers
    all_phdrs = []
    for i in range(e_phnum):
        ph_file_off = e_phoff + i * e_phentsize
        if ph_file_off + e_phentsize > len(data):
            break
        ph = parse_phdr(data, ph_file_off, is_64, endian)
        ph['_index'] = i
        ph['_file_off'] = ph_file_off
        all_phdrs.append(ph)

    # Get LOAD segments
    load_segs = [ph for ph in all_phdrs if ph['p_type'] == PT_LOAD]

    # Check if any LOAD segment needs fixing
    needs_fix = False
    for seg in load_segs:
        if seg['p_align'] < PAGE_SIZE_16KB:
            needs_fix = True
            break
        if seg['p_offset'] % PAGE_SIZE_16KB != seg['p_vaddr'] % PAGE_SIZE_16KB:
            needs_fix = True
            break

    if not needs_fix:
        return False

    # Sort LOAD segments by p_offset for sequential processing
    load_segs_sorted = sorted(load_segs, key=lambda s: s['p_offset'])

    # Calculate padding needed for each LOAD segment to satisfy:
    #   new_p_offset % 0x4000 == p_vaddr % 0x4000
    # shifts: list of (original_insert_position, padding_bytes)
    shifts = []
    running_shift = 0

    for seg in load_segs_sorted:
        orig_offset = seg['p_offset']
        effective_offset = orig_offset + running_shift
        target_rem = seg['p_vaddr'] % PAGE_SIZE_16KB
        current_rem = effective_offset % PAGE_SIZE_16KB

        if current_rem != target_rem:
            padding = (target_rem - current_rem) % PAGE_SIZE_16KB
            shifts.append((orig_offset, padding))
            running_shift += padding

    # Function to compute new file offset from original offset
    def compute_new_offset(orig_off):
        shift = 0
        for insert_pos, pad in shifts:
            if insert_pos <= orig_off:
                shift += pad
        return orig_off + shift

    # Build new file data by inserting padding
    if running_shift > 0:
        new_data = bytearray(data)
        # Process from end to start so earlier positions stay valid
        for insert_pos, pad in reversed(shifts):
            new_data = new_data[:insert_pos] + b'\x00' * pad + new_data[insert_pos:]
    else:
        new_data = bytearray(data)

    # Update ALL program headers with new p_offset and p_align
    # Program headers are within the first LOAD segment (offset 0) so their
    # file position doesn't change
    for i, ph in enumerate(all_phdrs):
        ph_pos = e_phoff + i * e_phentsize
        new_p_offset = compute_new_offset(ph['p_offset'])

        if is_64:
            # p_offset is at byte 8 in 64-bit program header
            struct.pack_into(endian + 'Q', new_data, ph_pos + 8, new_p_offset)
            if ph['p_type'] == PT_LOAD:
                # p_align is at byte 48
                struct.pack_into(endian + 'Q', new_data, ph_pos + 48, PAGE_SIZE_16KB)
        else:
            # p_offset is at byte 4 in 32-bit program header
            struct.pack_into(endian + 'I', new_data, ph_pos + 4, new_p_offset)
            if ph['p_type'] == PT_LOAD:
                # p_align is at byte 28
                struct.pack_into(endian + 'I', new_data, ph_pos + 28, PAGE_SIZE_16KB)

    # Update e_shoff in ELF header
    if e_shoff > 0 and e_shnum > 0:
        new_e_shoff = compute_new_offset(e_shoff)
        if is_64:
            struct.pack_into(endian + 'Q', new_data, 40, new_e_shoff)
        else:
            struct.pack_into(endian + 'I', new_data, 32, new_e_shoff)

        # Update sh_offset in each section header
        for i in range(e_shnum):
            old_sh_pos = e_shoff + i * e_shentsize
            new_sh_pos = new_e_shoff + i * e_shentsize

            if old_sh_pos + e_shentsize > len(data):
                break
            if new_sh_pos + e_shentsize > len(new_data):
                break

            if is_64:
                # sh_offset is at byte 24 in 64-bit section header
                old_sh_offset = struct.unpack_from(endian + 'Q', data, old_sh_pos + 24)[0]
                struct.pack_into(endian + 'Q', new_data, new_sh_pos + 24, compute_new_offset(old_sh_offset))
            else:
                # sh_offset is at byte 16 in 32-bit section header
                old_sh_offset = struct.unpack_from(endian + 'I', data, old_sh_pos + 16)[0]
                struct.pack_into(endian + 'I', new_data, new_sh_pos + 16, compute_new_offset(old_sh_offset))

    with open(filepath, 'wb') as f:
        f.write(new_data)

    return True


def patch_all_so_files(directory):
    count = 0
    errors = 0
    for root, dirs, files in os.walk(directory):
        for fname in files:
            if fname.endswith('.so'):
                fpath = os.path.join(root, fname)
                try:
                    if realign_elf_16kb(fpath):
                        count += 1
                        print(f"  Patched: {fname}")
                except Exception as e:
                    errors += 1
                    print(f"  ERROR: {fname}: {e}")
    print(f"\nTotal patched: {count}, Errors: {errors}")


if __name__ == "__main__":
    target_dir = sys.argv[1] if len(sys.argv) > 1 else "."
    print(f"ELF 16KB Alignment Patcher - scanning {target_dir}")
    patch_all_so_files(target_dir)
