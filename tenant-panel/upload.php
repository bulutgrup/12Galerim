<?php
// Farklı subdomainlerden (gm.galerim.app gibi) ve localhost'tan gelen isteklere izin ver (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Geçersiz istek metodu']);
    exit;
}

if (!isset($_FILES['image'])) {
    echo json_encode(['error' => 'Dosya bulunamadı']);
    exit;
}

$file = $_FILES['image'];
$tenantId = isset($_POST['tenant_id']) ? preg_replace('/[^a-zA-Z0-9-]/', '', $_POST['tenant_id']) : 'genel';

// Sunucuda uploads/ klasörü altında galeri id'sine göre klasör aç
$uploadDir = 'uploads/' . $tenantId . '/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Dosya uzantısını kontrol et (Güvenlik için sadece resim formatları)
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
if (!in_array(strtolower($ext), $allowed)) {
    echo json_encode(['error' => 'Geçersiz dosya tipi']);
    exit;
}

// Güvenli ve benzersiz dosya adı oluştur
$fileName = time() . '_' . uniqid() . '.' . strtolower($ext);
$targetPath = $uploadDir . $fileName;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    // Görselin dışarıdan erişilebilir bağlantısını oluştur
    $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https' : 'http';
    $host = 'ilan.galerim.app'; // Doğrudan ilan.galerim.app üzerinden çağrılacak
    $publicUrl = $protocol . '://' . $host . '/' . $targetPath;
    
    echo json_encode(['url' => $publicUrl]);
} else {
    echo json_encode(['error' => 'Dosya kaydedilirken sunucu hatası oluştu']);
}
?>