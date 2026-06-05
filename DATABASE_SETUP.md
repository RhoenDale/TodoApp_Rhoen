# TodoApp Database Setup Guide

## Overview
This guide explains how to set up the TodoApp database on InfinityFree and configure your environment.

## Database Schema

The TodoApp uses the following tables:

### 1. **users** table
- Stores user account information
- Fields: id, name, email, password, dark_mode, created_at, updated_at, last_login_at
- Primary Key: id
- Unique Index: email

### 2. **tasks** table
- Stores user tasks/todos
- Fields: id, user_id, title, description, completed, created_at, updated_at
- Foreign Key: user_id → users(id)
- Indexes: user_id, completed

### 3. **notes** table
- Stores user notes
- Fields: id, user_id, title, content, created_at, updated_at
- Foreign Key: user_id → users(id)
- Indexes: user_id

### 4. **sessions** table
- Manages user authentication tokens
- Fields: id, user_id, token, expires_at, created_at
- Foreign Key: user_id → users(id)
- Indexes: user_id, token, expires_at

## Setup Instructions for InfinityFree

### Step 1: Create Database on InfinityFree
1. Log in to your InfinityFree account
2. Go to MySQL Manager
3. Create a new database (e.g., `if0_xxxxx_todoapp`)
4. Note your database credentials:
   - Host: `sql123.infinityfree.com` (or similar)
   - Database Name: `if0_xxxxx_todoapp`
   - Username: `if0_xxxxx_user`
   - Password: (as set during creation)

### Step 2: Import Database Schema
1. In InfinityFree MySQL Manager, click on your database
2. Go to phpMyAdmin
3. Click "Import" tab
4. Upload the `database/database.sql` file
5. Click "Go" to execute

### Step 3: Configure Environment Variables
1. Copy `.env.example` to `.env`
2. Update with your InfinityFree credentials:
```env
DB_HOST=sql123.infinityfree.com
DB_NAME=if0_xxxxx_todoapp
DB_USER=if0_xxxxx_user
DB_PASSWORD=your_password
```

### Step 4: Set Up API Backend
1. Create PHP API files on InfinityFree:
   - `api/login.php`
   - `api/register.php`
   - `api/profile.php`
   - `api/logout.php`

Example structure:
```
public_html/
  api/
    config.php (database connection)
    login.php
    register.php
    profile.php
    logout.php
    tasks.php
    notes.php
```

### Step 5: Update Mobile App Config
In `constants/Config.ts`, update:
```typescript
export const API_BASE_URL = 'https://yourdomain.infinityfree.com/api';
```

## Database Maintenance

### Backup Database
1. In phpMyAdmin, select your database
2. Click "Export"
3. Choose "Quick" or "Custom" export
4. Click "Go" to download backup

### Reset Database
If you need to clear all data:
```sql
DELETE FROM tasks;
DELETE FROM notes;
DELETE FROM sessions;
DELETE FROM users;
```

## API Response Format

All API endpoints should return JSON in this format:

### Success Response (200)
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "darkMode": false,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "lastLoginAt": "2024-01-01T00:00:00Z"
  },
  "token": "jwt_token_here",
  "apiVersion": "1.0.0"
}
```

### Error Response
```json
{
  "message": "Error description here",
  "status": 400
}
```

## Security Notes
- Always use HTTPS in production
- Hash passwords with bcrypt or similar
- Store JWT secrets securely
- Validate all input data
- Use prepared statements to prevent SQL injection
- Implement rate limiting on API endpoints

## Troubleshooting

### Connection Errors
- Verify database credentials are correct
- Ensure InfinityFree database is active
- Check if API URL is accessible

### Token Expiration
- Tokens expire after 7 days by default
- Implement refresh token logic for better UX

### CORS Issues
- If frontend is on different domain, configure CORS headers in API files
- Add appropriate CORS headers in PHP:
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```
