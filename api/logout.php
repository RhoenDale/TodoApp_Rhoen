<?php
// api/logout.php - User logout endpoint

require_once 'config.php';

if ($request_method !== 'POST') {
    send_error('Method not allowed', 405);
}

// Get authorization token
$token = get_auth_token();
if (!$token) {
    send_error('Authorization token required', 401);
}

// Decode and validate token
$payload = decode_jwt($token);
if (!$payload) {
    send_error('Invalid or expired token', 401);
}

$user_id = $payload['user_id'];

// Delete session from database
$stmt = $mysqli->prepare('DELETE FROM sessions WHERE user_id = ? AND token = ?');
if (!$stmt) {
    send_error('Database error', 500);
}

$stmt->bind_param('is', $user_id, $token);
if (!$stmt->execute()) {
    send_error('Database error', 500);
}

$stmt->close();

$response = ['ok' => true, 'message' => 'Logged out successfully'];
send_success($response, 200);

?>
