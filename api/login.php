<?php
// api/login.php - User login endpoint

require_once 'config.php';

if ($request_method !== 'POST') {
    send_error('Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    send_error('Invalid JSON input', 400);
}

$email = $input['email'] ?? null;
$password = $input['password'] ?? null;
$appVersion = $input['appVersion'] ?? '1.0.0';

if (!$email || !$password) {
    send_error('Email and password are required', 400);
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_error('Invalid email format', 400);
}

// Get user from database
$stmt = $mysqli->prepare('SELECT id, name, email, password, dark_mode, created_at, updated_at, last_login_at FROM users WHERE email = ?');
if (!$stmt) {
    send_error('Database error', 500);
}

$stmt->bind_param('s', $email);
if (!$stmt->execute()) {
    send_error('Database error', 500);
}

$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user || !password_verify($password, $user['password'])) {
    send_error('Invalid email or password', 401);
}

// Update last login time
$now = date('Y-m-d H:i:s');
$update_stmt = $mysqli->prepare('UPDATE users SET last_login_at = ? WHERE id = ?');
if ($update_stmt) {
    $update_stmt->bind_param('si', $now, $user['id']);
    $update_stmt->execute();
    $update_stmt->close();
}

// Generate JWT token
$token = generate_jwt($user['id']);

// Store session in database
$insert_stmt = $mysqli->prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)');
if ($insert_stmt) {
    $expires_at = date('Y-m-d H:i:s', time() + (7 * 24 * 60 * 60));
    $insert_stmt->bind_param('iss', $user['id'], $token, $expires_at);
    $insert_stmt->execute();
    $insert_stmt->close();
}

// Prepare response
$response = [
    'token' => $token,
    'user' => [
        'id' => (int)$user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'darkMode' => (bool)$user['dark_mode'],
        'createdAt' => $user['created_at'],
        'updatedAt' => $user['updated_at'],
        'lastLoginAt' => $user['last_login_at']
    ],
    'apiVersion' => '1.0.0'
];

send_success($response, 200);

?>
