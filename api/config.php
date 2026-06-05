<?php
// api/config.php - Database connection configuration

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database credentials - Load from environment variables
$db_host = getenv('DB_HOST') ?: 'sql200.infinityfree.com';
$db_user = getenv('DB_USER') ?: 'if0_42037620';
$db_password = getenv('DB_PASSWORD') ?: 'j3fqZZHBekAEF';
$db_name = getenv('DB_NAME') ?: 'if0_42037620_todoapp';

// Create connection
$mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);

// Check connection
if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(['message' => 'Database connection failed: ' . $mysqli->connect_error]);
    exit();
}

$mysqli->set_charset('utf8mb4');

// JWT Secret
$jwt_secret = getenv('JWT_SECRET') ?: 'your_super_secret_jwt_key_change_this_in_production';

// Helper function to send error response
function send_error($message, $status = 400) {
    http_response_code($status);
    echo json_encode(['message' => $message]);
    exit();
}

// Helper function to send success response
function send_success($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit();
}

// Helper function to get Authorization header
function get_auth_token() {
    $headers = getallheaders();
    if (isset($headers['Authorization'])) {
        $matches = [];
        if (preg_match('/Bearer\s+(.+)/', $headers['Authorization'], $matches)) {
            return $matches[1];
        }
    }
    return null;
}

// Helper function to decode JWT (simplified)
function decode_jwt($token) {
    global $jwt_secret;
    
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }
    
    // Simple JWT validation - In production, use a JWT library
    $header = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[0])), true);
    $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);
    $signature = $parts[2];
    
    // Verify signature
    $hash = hash_hmac('sha256', $parts[0] . '.' . $parts[1], $jwt_secret, true);
    $computed_signature = rtrim(strtr(base64_encode($hash), '+/', '-_'), '=');
    
    if ($signature !== $computed_signature) {
        return null;
    }
    
    // Check expiration
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return null;
    }
    
    return $payload;
}

// Helper function to generate JWT
function generate_jwt($user_id) {
    global $jwt_secret;
    
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    $payload = [
        'user_id' => $user_id,
        'iat' => time(),
        'exp' => time() + (7 * 24 * 60 * 60) // 7 days
    ];
    
    $header_encoded = rtrim(strtr(base64_encode(json_encode($header)), '+/', '-_'), '=');
    $payload_encoded = rtrim(strtr(base64_encode(json_encode($payload)), '+/', '-_'), '=');
    
    $signature = hash_hmac('sha256', $header_encoded . '.' . $payload_encoded, $jwt_secret, true);
    $signature_encoded = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');
    
    return $header_encoded . '.' . $payload_encoded . '.' . $signature_encoded;
}

// Get request method and path
$request_method = $_SERVER['REQUEST_METHOD'];
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$script_name = dirname($_SERVER['SCRIPT_NAME']);
$request_path = substr($request_uri, strlen($script_name));

?>
