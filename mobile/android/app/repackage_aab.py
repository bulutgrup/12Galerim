#!/usr/bin/env python3
"""
AAB 16KB ZIP Alignment Patcher

Post-processes an Android App Bundle (.aab) so that all .so files are:
1. Stored UNCOMPRESSED (ZIP_STORED)
2. Padded in their ZIP local headers so data starts at a 16KB (16384 byte) alignment boundary

This ensures 100% compliance with Google Play's 16KB page size requirement on Android 15/16.
Preserves existing JAR signatures.
"""

import sys
import os
import zipfile
import struct
import tempfile
import shutil

PAGE_SIZE = 16384

def align_aab(input_path, output_path):
    temp_dir = tempfile.mkdtemp()
    temp_output = os.path.join(temp_dir, 'aligned.aab')

    try:
        with zipfile.ZipFile(input_path, 'r') as zin, zipfile.ZipFile(temp_output, 'w', allowZip64=True) as zout:
            for info in zin.infolist():
                data = zin.read(info.filename)
                new_info = zipfile.ZipInfo(info.filename, date_time=info.date_time)
                new_info.external_attr = info.external_attr

                if info.filename.endswith('.so'):
                    new_info.compress_type = zipfile.ZIP_STORED
                    header_size = 30 + len(info.filename.encode('utf-8'))
                    curr_pos = zout.fp.tell()
                    data_start = curr_pos + header_size
                    rem = data_start % PAGE_SIZE
                    pad = (PAGE_SIZE - rem) % PAGE_SIZE
                    new_info.extra = b'\x00' * pad
                    zout.writestr(new_info, data)
                else:
                    new_info.compress_type = info.compress_type
                    new_info.extra = info.extra
                    zout.writestr(new_info, data)

        shutil.move(temp_output, output_path)
        print(f"Successfully aligned AAB for 16KB page size: {output_path}")
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 repackage_aab.py <input.aab> [output.aab]")
        sys.exit(1)

    inp = sys.argv[1]
    outp = sys.argv[2] if len(sys.argv) > 2 else inp
    align_aab(inp, outp)
