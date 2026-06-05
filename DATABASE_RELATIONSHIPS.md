# 📊 Database Relationships & InfinityFree Upload Guide

## 🔗 Database Relationships Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    DATABASE SCHEMA                       │
└─────────────────────────────────────────────────────────┘

                          USERS (1)
                            │ id (PK)
                ┌───────────┼───────────┬──────────────┐
                │           │           │              │
                ↓           ↓           ↓              ↓
            TASKS (∞)   NOTES (∞)  SESSIONS (∞)
          user_id (FK) user_id(FK) user_id (FK)
```

### Relationships Defined:

#### **1. Users → Tasks (1:Many)**
```sql
users.id ──PK──→ tasks.user_id ──FK──
│
└─ Relationship: One user has many tasks
└─ Foreign Key: tasks.user_id REFERENCES users(id)
└─ Delete Rule: ON DELETE CASCADE (delete user = delete all their tasks)
└─ Update Rule: ON UPDATE CASCADE (update user ID = update all task references)
```

#### **2. Users → Notes (1:Many)**
```sql
users.id ──PK──→ notes.user_id ──FK──
│
└─ Relationship: One user has many notes
└─ Foreign Key: notes.user_id REFERENCES users(id)
└─ Delete Rule: ON DELETE CASCADE (delete user = delete all their notes)
└─ Update Rule: ON UPDATE CASCADE (update user ID = update all note references)
```

#### **3. Users → Sessions (1:Many)**
```sql
users.id ──PK──→ sessions.user_id ──FK──
│
└─ Relationship: One user has many sessions (one per device/login)
└─ Foreign Key: sessions.user_id REFERENCES users(id)
└─ Delete Rule: ON DELETE CASCADE (delete user = delete all their sessions)
└─ Update Rule: ON UPDATE CASCADE (update user ID = update all session references)
```

---

## 📋 Table Structure with Relationships

### **USERS Table (Master Table)**
```
┌─────────────────────────────────────────┐
│           users                         │
├─────────────────────────────────────────┤
│ PK: id (INT, AUTO_INCREMENT)            │
│ name (VARCHAR 255)                      │
│ email (VARCHAR 255, UNIQUE)             │
│ password (VARCHAR 255, HASHED)          │
│ dark_mode (BOOLEAN, default: FALSE)     │
│ created_at (TIMESTAMP)                  │
│ updated_at (TIMESTAMP)                  │
│ last_login_at (TIMESTAMP, nullable)     │
│                                         │
│ INDEX: idx_email (for login speed)      │
└─────────────────────────────────────────┘
         ↓ Master Record
```

### **TASKS Table (Related to users)**
```
┌─────────────────────────────────────────┐
│           tasks                         │
├─────────────────────────────────────────┤
│ PK: id (INT, AUTO_INCREMENT)            │
│ FK: user_id (INT) ──→ users.id          │
│ title (VARCHAR 255)                     │
│ description (LONGTEXT)                  │
│ completed (BOOLEAN, default: FALSE)     │
│ created_at (TIMESTAMP)                  │
│ updated_at (TIMESTAMP)                  │
│                                         │
│ FOREIGN KEY: user_id → users.id         │
│   - ON DELETE CASCADE                   │
│   - ON UPDATE CASCADE                   │
│                                         │
│ INDEXES:                                │
│ - idx_user_id (filter by user)          │
│ - idx_completed (filter by status)      │
└─────────────────────────────────────────┘
```

### **NOTES Table (Related to users)**
```
┌─────────────────────────────────────────┐
│           notes                         │
├─────────────────────────────────────────┤
│ PK: id (INT, AUTO_INCREMENT)            │
│ FK: user_id (INT) ──→ users.id          │
│ title (VARCHAR 255)                     │
│ content (LONGTEXT)                      │
│ created_at (TIMESTAMP)                  │
│ updated_at (TIMESTAMP)                  │
│                                         │
│ FOREIGN KEY: user_id → users.id         │
│   - ON DELETE CASCADE                   │
│   - ON UPDATE CASCADE                   │
│                                         │
│ INDEX:                                  │
│ - idx_user_id (filter by user)          │
└─────────────────────────────────────────┘
```

### **SESSIONS Table (Related to users)**
```
┌──────────────────────────────────────────┐
│           sessions                       │
├──────────────────────────────────────────┤
│ PK: id (INT, AUTO_INCREMENT)             │
│ FK: user_id (INT) ──→ users.id           │
│ token (VARCHAR 500, UNIQUE)              │
│ expires_at (TIMESTAMP)                   │
│ created_at (TIMESTAMP)                   │
│                                          │
│ FOREIGN KEY: user_id → users.id          │
│   - ON DELETE CASCADE                    │
│   - ON UPDATE CASCADE                    │
│                                          │
│ INDEXES:                                 │
│ - idx_user_id (filter by user)           │
│ - idx_token (lookup session by token)    │
│ - idx_expires_at (cleanup expired)       │
└──────────────────────────────────────────┘
```

---

## 🚀 Files to Upload to InfinityFree

### **Total Files to Upload: 6 Files**

```
api/
├── config.php          ← Database connection & JWT helpers
├── login.php           ← Login endpoint
├── register.php        ← Registration endpoint
├── profile.php         ← Profile get/update endpoint
├── logout.php          ← Logout endpoint
└── .htaccess           ← Apache rewrite rules (optional but recommended)
```

### **File Upload Details**

| File | Size | Purpose | Required |
|------|------|---------|----------|
| `config.php` | ~3 KB | Database connection, JWT functions | ✅ YES |
| `login.php` | ~2 KB | User login endpoint | ✅ YES |
| `register.php` | ~2.5 KB | User registration endpoint | ✅ YES |
| `profile.php` | ~3.5 KB | Get/update user profile | ✅ YES |
| `logout.php` | ~1.5 KB | User logout endpoint | ✅ YES |
| `.htaccess` | ~0.5 KB | Apache rewrite rules | ⚠️ OPTIONAL |

**Total Size**: ~12.5 KB (very small)

---

## 📤 Step-by-Step Upload Instructions

### **Method 1: Using FTP (Recommended)**

```
1. Open FTP Client (FileZilla, WinSCP, etc.)
2. Connect to: sql200.infinityfree.com (or your host)
   - Username: your_infinityfree_username
   - Password: your_infinityfree_password
   
3. Navigate to public_html/ folder

4. Create folder: api
   (Right-click → Create new folder → name: "api")

5. Upload all files from your local api/ folder:
   - config.php
   - login.php
   - register.php
   - profile.php
   - logout.php
   - .htaccess

6. Verify files are uploaded (you should see them in api/ folder)

7. Set file permissions (if not 644 automatically):
   - Right-click each .php file → File permissions → 644
```

### **Method 2: Using InfinityFree File Manager**

```
1. Login to InfinityFree → cPanel
2. Go to File Manager
3. Navigate to public_html/
4. Create new folder "api"
5. Open api/ folder
6. Upload all files from your local api/ folder
7. Done! Files are now live
```

### **Method 3: Using cPanel Advanced Features**

```
1. Login to InfinityFree cPanel
2. Open "File Manager"
3. Navigate to public_html/
4. Click "Upload" button
5. Select all files from your local api/ folder
6. Click "Upload"
7. Files appear in public_html/
8. Create api/ folder and move files there
```

---

## ✅ File Structure After Upload

```
public_html/
├── index.html (or your main site files)
├── api/
│   ├── config.php
│   ├── login.php
│   ├── register.php
│   ├── profile.php
│   ├── logout.php
│   └── .htaccess
└── ... other files
```

---

## 🔗 Accessing Your API After Upload

Once uploaded, your API endpoints will be available at:

```
https://to-do-listrhoen.infinityfreeapp.com/api/login.php
https://to-do-listrhoen.infinityfreeapp.com/api/register.php
https://to-do-listrhoen.infinityfreeapp.com/api/profile.php
https://to-do-listrhoen.infinityfreeapp.com/api/logout.php
```

---

## 📊 Database Cascade Rules Explained

### **What is ON DELETE CASCADE?**

When you delete a user, all related records are automatically deleted:

```
DELETE FROM users WHERE id = 5;

Result:
- User #5 is deleted ✓
- All tasks for user #5 are deleted ✓
- All notes for user #5 are deleted ✓
- All sessions for user #5 are deleted ✓

This prevents orphaned records in the database.
```

### **What is ON UPDATE CASCADE?**

If a user ID is updated, all related records are updated:

```
UPDATE users SET id = 10 WHERE id = 5;

Result:
- User ID changed from 5 to 10 ✓
- All tasks.user_id changed from 5 to 10 ✓
- All notes.user_id changed from 5 to 10 ✓
- All sessions.user_id changed from 5 to 10 ✓

This maintains referential integrity.
```

---

## 🗄️ Database Indexes for Performance

```sql
-- Email lookup (for login)
INDEX idx_email (email)
Purpose: Fast login by email
Query Example: SELECT * FROM users WHERE email = 'user@example.com'

-- User ID lookup (for all child tables)
INDEX idx_user_id (user_id)
Purpose: Quickly find all records for a user
Query Example: SELECT * FROM tasks WHERE user_id = 5

-- Task completion status
INDEX idx_completed (completed)
Purpose: Quickly filter completed vs pending tasks
Query Example: SELECT * FROM tasks WHERE user_id = 5 AND completed = FALSE

-- Session token lookup
INDEX idx_token (token)
Purpose: Quickly verify JWT token validity
Query Example: SELECT * FROM sessions WHERE token = 'eyJhbGc...'

-- Session expiration cleanup
INDEX idx_expires_at (expires_at)
Purpose: Quickly find and delete expired sessions
Query Example: DELETE FROM sessions WHERE expires_at < NOW()
```

---

## 🔐 Referential Integrity

### **Before Upload Checklist**

- ✅ Database has been created in InfinityFree
- ✅ All tables created using database.sql
- ✅ Foreign key constraints are in place
- ✅ All .php files are ready to upload
- ✅ `.env` file has correct credentials
- ✅ JWT_SECRET is set in both .env and api/config.php

### **After Upload Checklist**

- ✅ All 6 files uploaded to public_html/api/
- ✅ Files are readable (permissions 644)
- ✅ API endpoint responds to POST requests
- ✅ Database connection successful
- ✅ JWT token generation working

---

## 🧪 Test Relationships After Upload

### **Test 1: Create User**
```bash
curl -X POST https://to-do-listrhoen.infinityfreeapp.com/api/register.php \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "appVersion": "1.1.0.0"
  }'
```

### **Test 2: Verify User Created with Session**
```bash
# In phpMyAdmin, run:
SELECT * FROM users;           -- Should see 1 user
SELECT * FROM sessions;        -- Should see 1 session (linked to user)
```

### **Test 3: Create Task (Requires valid token)**
```bash
curl -X POST https://to-do-listrhoen.infinityfreeapp.com/api/tasks.php \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token_from_test_1}" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, bread, eggs"
  }'
```

### **Test 4: Verify Relationships**
```bash
# In phpMyAdmin, run:
SELECT * FROM tasks WHERE user_id = 1;  -- Should see user's tasks
SELECT * FROM notes WHERE user_id = 1;  -- Should see user's notes
```

---

## 📝 Summary

### **Database Relationships**
- ✅ Users (1) ←→ (∞) Tasks
- ✅ Users (1) ←→ (∞) Notes
- ✅ Users (1) ←→ (∞) Sessions
- ✅ Cascade delete enabled
- ✅ Cascade update enabled
- ✅ Performance indexes added

### **Files to Upload to InfinityFree**
- ✅ 6 total files (5 PHP + 1 .htaccess)
- ✅ Location: `public_html/api/`
- ✅ Total size: ~12.5 KB
- ✅ Permissions: 644 for all files

### **Upload Methods**
- ✅ FTP (FileZilla, WinSCP)
- ✅ File Manager (cPanel)
- ✅ Advanced Upload (cPanel)

---

**Status**: Ready for InfinityFree deployment! ✓
