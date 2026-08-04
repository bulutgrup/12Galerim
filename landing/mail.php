<?php
/**
 * Galerim - SMTP Mail Gönderim Script
 * Port 465 (SMTPS/SSL) — Robust multi-line SMTP response reader
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']); exit;
}

$data    = json_decode(file_get_contents('php://input'), true) ?? [];
$name    = trim(strip_tags($data['name']    ?? ''));
$phone   = trim(strip_tags($data['phone']   ?? ''));
$gallery = trim(strip_tags($data['gallery'] ?? ''));
$message = trim(strip_tags($data['message'] ?? ''));
$type    = trim($data['type'] ?? 'contact');

if (!$name || !$message) {
    echo json_encode(['ok' => false, 'error' => 'Ad ve mesaj zorunludur.']); exit;
}

// ─── SMTP Ayarları ────────────────────────────────────────────────────────────
const SMTP_HOST  = 'srvc232.trwww.com';
const SMTP_PORT  = 465;
const SMTP_USER  = 'no-reply@cqst.tr';
const SMTP_PASS  = 'Blt*2025!!';
const FROM_EMAIL = 'no-reply@cqst.tr';
const FROM_NAME  = 'Galerim Web';
const TO_EMAIL   = 'admin@bulutgrup.tr';

// ─── Konu ve Gövde ───────────────────────────────────────────────────────────
if ($type === 'register') {
    $email   = trim(strip_tags($data['email'] ?? ''));
    $slug    = trim(strip_tags($data['slug']  ?? ''));
    $owner   = trim(strip_tags($data['owner'] ?? ''));
    $subject = '🆕 Yeni Üyelik Talebi — ' . $name;
    $body    = "Yeni bir galeri kayıt talebi geldi:\n\n"
             . "Galeri Adı  : {$name}\n"
             . "Subdomain   : {$slug}.galerim.app\n"
             . "Yetkili     : {$owner}\n"
             . "Telefon     : {$phone}\n"
             . "E-posta     : {$email}\n"
             . "Paket       : 14 Gün Ücretsiz Deneme\n\n"
             . "Tarih       : " . date('d.m.Y H:i') . "\n";
} else {
    $subject = '📬 Galerim İletişim Formu — ' . $name . ' / ' . $gallery;
    $body    = "Yeni bir iletişim formu mesajı:\n\n"
             . "Ad Soyad    : {$name}\n"
             . "Telefon     : {$phone}\n"
             . "Galeri Adı  : {$gallery}\n\n"
             . "Mesaj:\n{$message}\n\n"
             . "Tarih       : " . date('d.m.Y H:i') . "\n";
}

// ─── Yardımcı: Tüm SMTP yanıt satırlarını oku ────────────────────────────────
// SMTP çok satırlı yanıtlar: "250-devam\r\n" (tire), "250 son\r\n" (boşluk)
function smtp_read($sock, &$code = 0): string
{
    $full = '';
    while (!feof($sock)) {
        $line = fgets($sock, 512);
        if ($line === false) break;
        $full .= $line;
        // Son satır: 4. karakter boşluk veya satır çok kısa
        if (strlen($line) < 4 || $line[3] === ' ') {
            $code = (int) substr($line, 0, 3);
            break;
        }
        // Devam satırı: tire varsa okumaya devam et (250-...)
    }
    return $full;
}

function smtp_cmd($sock, string $cmd, &$code = 0): string
{
    fputs($sock, $cmd . "\r\n");
    return smtp_read($sock, $code);
}

// ─── SMTP Gönderimi ──────────────────────────────────────────────────────────
function smtp_send_mail(string $subject, string $body): void
{
    $ctx = stream_context_create([
        'ssl' => [
            'verify_peer'       => false,
            'verify_peer_name'  => false,
            'allow_self_signed' => true,
        ]
    ]);

    $sock = @stream_socket_client(
        'ssl://' . SMTP_HOST . ':' . SMTP_PORT,
        $errno, $errstr, 15,
        STREAM_CLIENT_CONNECT, $ctx
    );
    if (!$sock) {
        throw new RuntimeException("Bağlantı kurulamadı ({$errno}): {$errstr}");
    }
    stream_set_timeout($sock, 10);

    // 1. Sunucu karşılama (220)
    $code = 0;
    smtp_read($sock, $code);
    if ($code !== 220) throw new RuntimeException("Karşılama hatası (beklenen 220, gelen {$code})");

    // 2. EHLO — tüm satırları tüket
    smtp_cmd($sock, 'EHLO galerim.app', $code);
    if ($code !== 250) throw new RuntimeException("EHLO hatası: {$code}");

    // 3. AUTH LOGIN
    smtp_cmd($sock, 'AUTH LOGIN', $code);
    if ($code !== 334) throw new RuntimeException("AUTH LOGIN başlatılamadı: {$code}");

    // 4. Kullanıcı adı
    smtp_cmd($sock, base64_encode(SMTP_USER), $code);
    if ($code !== 334) throw new RuntimeException("Kullanıcı adı kabul edilmedi: {$code}");

    // 5. Şifre
    smtp_cmd($sock, base64_encode(SMTP_PASS), $code);
    if ($code !== 235) throw new RuntimeException("Kimlik doğrulama başarısız (kod: {$code}) — şifre veya kullanıcı adı hatalı");

    // 6. MAIL FROM
    smtp_cmd($sock, 'MAIL FROM: <' . FROM_EMAIL . '>', $code);
    if ($code !== 250) throw new RuntimeException("MAIL FROM hatası: {$code}");

    // 7. RCPT TO
    smtp_cmd($sock, 'RCPT TO: <' . TO_EMAIL . '>', $code);
    if ($code !== 250) throw new RuntimeException("RCPT TO hatası: {$code}");

    // 8. DATA
    smtp_cmd($sock, 'DATA', $code);
    if ($code !== 354) throw new RuntimeException("DATA başlatılamadı: {$code}");

    // 9. Mesaj içeriği
    $subjectEncoded = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $fromEncoded    = '=?UTF-8?B?' . base64_encode(FROM_NAME) . '?=';

    $msg = "Date: " . date('r') . "\r\n"
         . "From: {$fromEncoded} <" . FROM_EMAIL . ">\r\n"
         . "To: " . TO_EMAIL . "\r\n"
         . "Subject: {$subjectEncoded}\r\n"
         . "MIME-Version: 1.0\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n"
         . "Content-Transfer-Encoding: base64\r\n"
         . "\r\n"
         . chunk_split(base64_encode($body))
         . "\r\n.\r\n";      // DATA sonu

    fputs($sock, $msg);
    smtp_read($sock, $code);
    if ($code !== 250) throw new RuntimeException("Mesaj gönderim hatası: {$code}");

    // 10. QUIT
    fputs($sock, "QUIT\r\n");
    fclose($sock);
}

// ─── Çalıştır ────────────────────────────────────────────────────────────────
try {
    smtp_send_mail($subject, $body);
    echo json_encode(['ok' => true, 'message' => 'Mail gönderildi.']);
} catch (RuntimeException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}
