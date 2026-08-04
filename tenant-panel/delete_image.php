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

// JSON verisini al
$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['urls']) || !is_array($input['urls'])) {
    echo json_encode(['error' => 'Geçersiz veri formatı veya eksik url listesi']);
    exit;
}

$deletedCount = 0;
$errors = [];

foreach ($input['urls'] as $url) {
    if (empty($url)) continue;
    
    // Güvenlik Kontrolü: Sadece ilan.galerim.app/uploads/ altındaki dosyaları silmeye izin ver
    $parsedUrl = parse_url($url);
    $path = isset($parsedUrl['path']) ? ltrim($parsedUrl['path'], '/') : '';
    
    // Yolun uploads/ ile başladığından emin ol ve üst klasörlere gitmeyi engelle (../)
    if (strpos($path, 'uploads/') === 0 && strpos($path, '..') === false) {
        if (file_exists($path)) {
            if (unlink($path)) {
                $deletedCount++;
            } else {
                $errors[] = "Dosya silinemedi: " . $url;
            }
        }
    } else {
        $errors[] = "Geçersiz veya yetkisiz dosya yolu: " . $url;
    }
}

echo json_encode([
    'success' => true,
    'deleted_count' => $deletedCount,
    'errors' => $errors
]);
?>
