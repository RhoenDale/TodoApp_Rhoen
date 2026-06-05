# InfinityFree Database Setup Guide

## SQL Database Schema

Copy and paste this into your InfinityFree phpMyAdmin SQL editor:

```sql
-- TodoApp Database Schema
-- Compatible with MySQL/InfinityFree

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  dark_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP NULL,
  INDEX idx_email (email)
);

-- Create Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_completed (completed)
);

-- Create Notes table
CREATE TABLE IF NOT EXISTS notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);

-- Create Sessions table for token management
CREATE TABLE IF NOT EXISTS sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_token (token),
  INDEX idx_expires_at (expires_at)
);
```

## API Endpoints Configuration

### Base URL
```
https://yourdomain.infinityfree.com/api/
```

### Endpoints Available

#### 1. **POST /login.php** - User Login
```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "appVersion": "1.1.0.0"
}

Response:
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "darkMode": false,
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00",
    "lastLoginAt": "2024-01-02T12:00:00"
  },
  "apiVersion": "1.0.0"
}
```

#### 2. **POST /register.php** - User Registration
```json
Request:
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "appVersion": "1.1.0.0"
}

Response:
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "darkMode": false,
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00",
    "lastLoginAt": null
  },
  "apiVersion": "1.0.0"
}
```

#### 3. **GET /profile.php** - Get User Profile
```
Headers:
Authorization: Bearer {token}

Response:
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "darkMode": false,
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00",
    "lastLoginAt": "2024-01-02T12:00:00"
  },
  "apiVersion": "1.0.0"
}
```

#### 4. **PATCH /profile.php** - Update User Profile
```json
Headers:
Authorization: Bearer {token}

Request:
{
  "name": "Jane Doe",
  "darkMode": true,
  "appVersion": "1.1.0.0"
}

Response:
{
  "user": {
    "id": 1,
    "name": "Jane Doe",
    "email": "user@example.com",
    "darkMode": true,
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-02T14:30:00",
    "lastLoginAt": "2024-01-02T12:00:00"
  },
  "apiVersion": "1.0.0"
}
```

#### 5. **POST /logout.php** - User Logout
```
Headers:
Authorization: Bearer {token}

Response:
{
  "ok": true
}
```

## Environment Variables Setup

Create or update your `.env` file:

```env
# Frontend App Configuration
EXPO_PUBLIC_API_BASE_URL=https://yourdomain.infinityfree.com/api

# Backend Database Configuration (for your API server)
DB_HOST=sql123.infinityfree.com
DB_PORT=3306
DB_NAME=if0_xxxxx_todoapp
DB_USER=if0_xxxxx_user
DB_PASSWORD=your_infinityfree_password

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_generate_this_securely

# App Version
APP_VERSION=1.1.0.0
```

## Deployment Checklist

- [ ] Replace `yourdomain.infinityfree.com` with your actual domain
- [ ] Replace database credentials with your actual InfinityFree credentials
- [ ] Generate a secure JWT_SECRET using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Upload all files from `/api` folder to `public_html/api/`
- [ ] Run the SQL schema in phpMyAdmin
- [ ] Test login endpoint: `POST https://yourdomain.infinityfree.com/api/login.php`
- [ ] Verify CORS headers are working
- [ ] Update frontend `.env` with correct API URL
- [ ] Build and deploy the mobile app

## Common Issues & Solutions

### Issue: Database Connection Failed
**Solution**: 
1. Verify credentials in `.env`
2. Check if database exists in InfinityFree
3. Verify MySQL port (usually 3306)

### Issue: API Returns 404
**Solution**:
1. Ensure files are uploaded to `public_html/api/`
2. Check if PHP execution is enabled
3. Verify file permissions (644 for files)

### Issue: CORS Error
**Solution**:
1. Headers are already set in `config.php`
2. Clear browser cache
3. Test with curl command first

### Issue: JWT Token Invalid
**Solution**:
1. Ensure JWT_SECRET matches on both frontend and backend
2. Check token expiration (7 days by default)
3. Verify server time is correct

---
For more details, see `CHANGES_IMPLEMENTED.md`
