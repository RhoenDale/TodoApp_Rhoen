<?php
// api/profile.php - User profile endpoint (GET and PATCH)

require_once 'config.php';

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

if ($request_method === 'GET') {
    // Get user profile
    $stmt = $mysqli->prepare('SELECT id, name, email, password, dark_mode, created_at, updated_at, last_login_at FROM users WHERE id = ?');
    if (!$stmt) {
        send_error('Database error', 500);
    }

    $stmt->bind_param('i', $user_id);
    if (!$stmt->execute()) {
        send_error('Database error', 500);
    }

    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        send_error('User not found', 404);
    }

    // Check if token is still valid in sessions table
    $check_stmt = $mysqli->prepare('SELECT expires_at FROM sessions WHERE user_id = ? AND token = ?');
    if ($check_stmt) {
        $check_stmt->bind_param('is', $user_id, $token);
        $check_stmt->execute();
        $session_result = $check_stmt->get_result();
        if ($session_result->num_rows === 0) {
            send_error('Session not found or expired', 401);
        }
        $check_stmt->close();
    }

    $response = [
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

} elseif ($request_method === 'PATCH') {
    // Update user profile
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        send_error('Invalid JSON input', 400);
    }

    $name = $input['name'] ?? null;
    $darkMode = $input['darkMode'] ?? null;
    $appVersion = $input['appVersion'] ?? null;

    // Build update query
    $updates = [];
    $params = [];
    $types = '';

    if ($name !== null) {
        $updates[] = 'name = ?';
        $params[] = $name;
        $types .= 's';
    }

    if ($darkMode !== null) {
        $updates[] = 'dark_mode = ?';
        $params[] = $darkMode ? 1 : 0;
        $types .= 'i';
    }

    if (empty($updates)) {
        send_error('No fields to update', 400);
    }

    $updates[] = 'updated_at = NOW()';
    $params[] = $user_id;
    $types .= 'i';

    $query = 'UPDATE users SET ' . implode(', ', $updates) . ' WHERE id = ?';
    
    $stmt = $mysqli->prepare($query);
    if (!$stmt) {
        send_error('Database error', 500);
    }

    if (!$stmt->bind_param($types, ...$params)) {
        send_error('Database error', 500);
    }

    if (!$stmt->execute()) {
        send_error('Database error', 500);
    }

    $stmt->close();

    // Get updated user
    $select_stmt = $mysqli->prepare('SELECT id, name, email, dark_mode, created_at, updated_at, last_login_at FROM users WHERE id = ?');
    if (!$select_stmt) {
        send_error('Database error', 500);
    }

    $select_stmt->bind_param('i', $user_id);
    if (!$select_stmt->execute()) {
        send_error('Database error', 500);
    }

    $result = $select_stmt->get_result();
    $user = $result->fetch_assoc();
    $select_stmt->close();

    if (!$user) {
        send_error('User not found', 404);
    }

    $response = [
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

} else {
    send_error('Method not allowed', 405);
}

?>
