<?php
// api/register.php - User registration endpoint

require_once 'config.php';

if ($request_method !== 'POST') {
    send_error('Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    send_error('Invalid JSON input', 400);
}

$name = $input['name'] ?? null;
$email = $input['email'] ?? null;
$password = $input['password'] ?? null;
$appVersion = $input['appVersion'] ?? '1.0.0';

if (!$name || !$email || !$password) {
    send_error('Name, email, and password are required', 400);
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_error('Invalid email format', 400);
}

// Validate password strength (min 6 characters)
if (strlen($password) < 6) {
    send_error('Password must be at least 6 characters long', 400);
}

// Check if email already exists
$check_stmt = $mysqli->prepare('SELECT id FROM users WHERE email = ?');
if (!$check_stmt) {
    send_error('Database error', 500);
}

$check_stmt->bind_param('s', $email);
if (!$check_stmt->execute()) {
    send_error('Database error', 500);
}

$result = $check_stmt->get_result();
if ($result->num_rows > 0) {
    send_error('Email already registered', 409);
}
$check_stmt->close();

// Hash password
$hashed_password = password_hash($password, PASSWORD_BCRYPT);

// Insert new user
$insert_stmt = $mysqli->prepare('INSERT INTO users (name, email, password, dark_mode) VALUES (?, ?, ?, FALSE)');
if (!$insert_stmt) {
    send_error('Database error', 500);
}

$insert_stmt->bind_param('sss', $name, $email, $hashed_password);
if (!$insert_stmt->execute()) {
    send_error('Database error', 500);
}

$user_id = $insert_stmt->insert_id;
$insert_stmt->close();

// Generate JWT token
$token = generate_jwt($user_id);

// Store session in database
$session_stmt = $mysqli->prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)');
if ($session_stmt) {
    $expires_at = date('Y-m-d H:i:s', time() + (7 * 24 * 60 * 60));
    $session_stmt->bind_param('iss', $user_id, $token, $expires_at);
    $session_stmt->execute();
    $session_stmt->close();
}

// Get created_at and updated_at timestamps
$now = date('Y-m-d H:i:s');

// Prepare response
$response = [
    'token' => $token,
    'user' => [
        'id' => (int)$user_id,
        'name' => $name,
        'email' => $email,
        'darkMode' => false,
        'createdAt' => $now,
        'updatedAt' => $now,
        'lastLoginAt' => null
    ],
    'apiVersion' => '1.0.0'
];

send_success($response, 201);

?>
