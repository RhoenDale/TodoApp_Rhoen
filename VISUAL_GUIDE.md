# 🎯 Database Relationships & Upload Summary - Visual Guide

## 📊 Database Relationships at a Glance

### **Entity Relationship Diagram (ERD)**

```
┌──────────────────┐
│     USERS        │
├──────────────────┤
│ id (PK)          │
│ name             │
│ email            │
│ password         │
│ dark_mode        │
│ created_at       │
│ updated_at       │
│ last_login_at    │
└────────┬─────────┘
         │
    ┌────┴─────────────────────────────┐
    │                                  │
    │ (1:∞)                     (1:∞)  │
    │                                  │
    ↓                                  ↓
┌──────────────┐              ┌──────────────┐
│    TASKS     │              │    NOTES     │
├──────────────┤              ├──────────────┤
│ id (PK)      │              │ id (PK)      │
│ user_id (FK) │              │ user_id (FK) │
│ title        │              │ title        │
│ description  │              │ content      │
│ completed    │              │ created_at   │
│ created_at   │              │ updated_at   │
│ updated_at   │              └──────────────┘
└──────────────┘

    ↓
┌──────────────────┐
│   SESSIONS       │
├──────────────────┤
│ id (PK)          │
│ user_id (FK)     │
│ token            │
│ expires_at       │
│ created_at       │
└──────────────────┘
    (1:∞)
```

---

## 🔗 Relationship Details

### **1️⃣ Users ↔ Tasks (One-to-Many)**
```
One User = Many Tasks

Example:
User #1 "John" 
├─ Task #1: Buy milk
├─ Task #2: Write report
├─ Task #3: Call Mom
└─ Task #4: Fix bug

Foreign Key: tasks.user_id → users.id
Delete Rule: Delete user = Delete all their tasks
```

### **2️⃣ Users ↔ Notes (One-to-Many)**
```
One User = Many Notes

Example:
User #1 "John"
├─ Note #1: Meeting notes
├─ Note #2: Ideas for project
└─ Note #3: Book summary

Foreign Key: notes.user_id → users.id
Delete Rule: Delete user = Delete all their notes
```

### **3️⃣ Users ↔ Sessions (One-to-Many)**
```
One User = Many Sessions (Login from different devices)

Example:
User #1 "John"
├─ Session #1: iPhone (token: abc123...)
├─ Session #2: Android (token: def456...)
└─ Session #3: Web browser (token: ghi789...)

Foreign Key: sessions.user_id → users.id
Delete Rule: Delete user = Delete all their sessions
```

---

## 📋 Files to Upload Summary

### **Complete File List**

```
DIRECTORY STRUCTURE TO CREATE:
┌─ public_html/
   ├─ api/                          ← CREATE THIS FOLDER
   │  ├─ config.php        ✅ UPLOAD
   │  ├─ login.php         ✅ UPLOAD
   │  ├─ register.php      ✅ UPLOAD
   │  ├─ profile.php       ✅ UPLOAD
   │  ├─ logout.php        ✅ UPLOAD
   │  └─ .htaccess         ✅ UPLOAD
   │
   └─ ... (your other website files)
```

### **File-by-File Breakdown**

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  config.php                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  • Connects to MySQL database                           │
│  • Generates JWT tokens for authentication              │
│  • Validates JWT tokens                                 │
│  • Provides helper functions (send_error, send_success) │
│  • Sets CORS headers                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  login.php (API Endpoint)                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  POST /api/login.php                                    │
│  Request: { email, password, appVersion }              │
│  Response: { token, user, apiVersion }                 │
│  • Validates email format                               │
│  • Verifies password                                    │
│  • Generates JWT token                                  │
│  • Creates session record (links to users.id)           │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  register.php (API Endpoint)                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  POST /api/register.php                                 │
│  Request: { name, email, password, appVersion }        │
│  Response: { token, user, apiVersion }                 │
│  • Validates all input fields                           │
│  • Checks if email already exists                       │
│  • Hashes password with bcrypt                          │
│  • Creates user (users table)                           │
│  • Generates JWT token                                  │
│  • Creates session record                               │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  profile.php (API Endpoint)                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  GET /api/profile.php                                   │
│  Request: Authorization: Bearer {token}                │
│  Response: { user, apiVersion }                        │
│                                                         │
│  PATCH /api/profile.php                                 │
│  Request: { name?, darkMode?, appVersion }             │
│  Response: { user, apiVersion }                        │
│  • Validates JWT token                                  │
│  • Gets user profile (read-only)                        │
│  • Updates user data (name, darkMode)                   │
│  • Prevents unauthorized access                         │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  logout.php (API Endpoint)                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  POST /api/logout.php                                   │
│  Request: Authorization: Bearer {token}                │
│  Response: { ok: true }                                 │
│  • Validates JWT token                                  │
│  • Deletes session record                               │
│  • Invalidates token for future use                     │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  .htaccess (Apache Configuration)                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  • Enables mod_rewrite for clean URLs                   │
│  • Removes .php extension from URLs                     │
│  • Sets CORS headers                                    │
│  • Protects config.php from direct access               │
│  • Handles 404 and 500 errors                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Structure Overview

### **Table Relationships Map**

```
DATABASE: if0_42037620_todoapp

┌─────────────────────────────────────┐
│           USERS                     │
├─────────────────────────────────────┤
│ PK: id (INT, AUTO_INCREMENT)        │
│ UNIQUE: email                       │
│ ├─ name (VARCHAR 255)               │
│ ├─ email (VARCHAR 255)              │
│ ├─ password (VARCHAR 255)           │
│ ├─ dark_mode (BOOLEAN)              │
│ ├─ created_at (TIMESTAMP)           │
│ ├─ updated_at (TIMESTAMP)           │
│ └─ last_login_at (TIMESTAMP NULL)   │
│                                     │
│ INDEXES:                            │
│ • idx_email (for login)             │
└────────────┬────────────────────────┘
             │
             ├─(1:∞)─→ TASKS
             │         ├─ id (PK)
             │         ├─ user_id (FK)
             │         ├─ title
             │         ├─ description
             │         ├─ completed (INDEX)
             │         ├─ created_at
             │         └─ updated_at
             │
             ├─(1:∞)─→ NOTES
             │         ├─ id (PK)
             │         ├─ user_id (FK)
             │         ├─ title
             │         ├─ content
             │         ├─ created_at
             │         └─ updated_at
             │
             └─(1:∞)─→ SESSIONS
                       ├─ id (PK)
                       ├─ user_id (FK)
                       ├─ token (UNIQUE)
                       ├─ expires_at (INDEX)
                       └─ created_at

CASCADE DELETE: ✓ Enabled on all relationships
CASCADE UPDATE: ✓ Enabled on all relationships
```

---

## ✅ Upload Checklist

### **Before Upload**
- [ ] All 6 files exist in `c:\Users\User\Downloads\TodoApp_Rhoen\api\`
- [ ] Database created in InfinityFree
- [ ] Tables created from database.sql
- [ ] .env file has correct credentials
- [ ] FTP credentials ready

### **During Upload**
- [ ] Connect to InfinityFree FTP
- [ ] Create `api` folder in `public_html/`
- [ ] Upload all 6 files to `public_html/api/`
- [ ] Set permissions to 644

### **After Upload**
- [ ] Test API with curl command
- [ ] Verify database connection
- [ ] Test signup endpoint
- [ ] Test login endpoint
- [ ] Check app can reach API

---

## 🚀 Quick Reference

### **What to Upload**
```
6 Files → public_html/api/
• config.php      (Database & JWT)
• login.php       (Login endpoint)
• register.php    (Register endpoint)
• profile.php     (Profile endpoint)
• logout.php      (Logout endpoint)
• .htaccess       (Security & routing)
```

### **Database Relationships**
```
users (Master)
├─→ tasks (1:∞)     [user_id FK]
├─→ notes (1:∞)     [user_id FK]
└─→ sessions (1:∞)  [user_id FK]

All have CASCADE DELETE & UPDATE enabled
```

### **API Endpoints Available**
```
POST   /api/login.php       → Authenticate user
POST   /api/register.php    → Create new account
GET    /api/profile.php     → Get user profile
PATCH  /api/profile.php     → Update user profile
POST   /api/logout.php      → End session
```

---

## 📍 File Locations

| File | Location |
|------|----------|
| config.php | c:\Users\User\Downloads\TodoApp_Rhoen\api\config.php |
| login.php | c:\Users\User\Downloads\TodoApp_Rhoen\api\login.php |
| register.php | c:\Users\User\Downloads\TodoApp_Rhoen\api\register.php |
| profile.php | c:\Users\User\Downloads\TodoApp_Rhoen\api\profile.php |
| logout.php | c:\Users\User\Downloads\TodoApp_Rhoen\api\logout.php |
| .htaccess | c:\Users\User\Downloads\TodoApp_Rhoen\api\.htaccess |

---

## 🎉 Status: Ready to Upload!

All files are prepared and ready for InfinityFree deployment.

**Next Step**: Follow the upload instructions in [FILES_TO_UPLOAD.md](FILES_TO_UPLOAD.md)

---

**Created**: June 5, 2026  
**Version**: 1.1.0.0  
**Status**: ✅ READY FOR DEPLOYMENT
