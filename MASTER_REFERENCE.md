# 🎓 Master Reference - Database Relationships & InfinityFree Upload

## 📚 Complete Documentation Index

### **Documentation Files Created**

| Document | Purpose | For Who |
|----------|---------|---------|
| [DATABASE_RELATIONSHIPS.md](DATABASE_RELATIONSHIPS.md) | Detailed relationships, table structures, indexes | Developers |
| [FILES_TO_UPLOAD.md](FILES_TO_UPLOAD.md) | Complete file list with upload instructions | Anyone deploying |
| [VISUAL_GUIDE.md](VISUAL_GUIDE.md) | Visual ERD and quick reference | Visual learners |
| [INFINITYFREE_SETUP.md](INFINITYFREE_SETUP.md) | Full deployment guide | Step-by-step users |
| [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md) | Complete implementation guide | Reference |
| [QUICKSTART.md](QUICKSTART.md) | 15-minute quick start | Impatient users |

---

## 🎯 TL;DR - The Essentials

### **1. Database Relationships (What are they?)**

Your database has 4 tables connected together:

```
USERS (Master Table)
  ↓
  ├─ TASKS (Each user has many tasks)
  ├─ NOTES (Each user has many notes)
  └─ SESSIONS (Each user can have many sessions/logins)

When you DELETE a user → all their tasks, notes, and sessions are automatically deleted
```

### **2. Files to Upload (6 Files)**

All files go to: `public_html/api/` on InfinityFree

```
✅ config.php       - Core database connection
✅ login.php        - Login endpoint
✅ register.php     - Registration endpoint
✅ profile.php      - Profile endpoint
✅ logout.php       - Logout endpoint
✅ .htaccess        - Security & routing
```

### **3. Upload Location**

```
From Local:
c:\Users\User\Downloads\TodoApp_Rhoen\api\*.php
c:\Users\User\Downloads\TodoApp_Rhoen\api\.htaccess

To InfinityFree:
https://to-do-listrhoen.infinityfreeapp.com/public_html/api/
```

---

## 🗄️ Database Schema - Relationships Explained

### **Relationship 1: Users ↔ Tasks (1:Many)**

```
One User = Many Tasks

SQL Definition:
CREATE TABLE tasks (
  id INT PRIMARY KEY,
  user_id INT NOT NULL,
  ...
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

What it means:
- Each task belongs to ONE user
- Each user can have MANY tasks
- If user is deleted → all their tasks are deleted
```

### **Relationship 2: Users ↔ Notes (1:Many)**

```
One User = Many Notes

SQL Definition:
CREATE TABLE notes (
  id INT PRIMARY KEY,
  user_id INT NOT NULL,
  ...
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

What it means:
- Each note belongs to ONE user
- Each user can have MANY notes
- If user is deleted → all their notes are deleted
```

### **Relationship 3: Users ↔ Sessions (1:Many)**

```
One User = Many Sessions (login from multiple devices)

SQL Definition:
CREATE TABLE sessions (
  id INT PRIMARY KEY,
  user_id INT NOT NULL,
  ...
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

What it means:
- Each session belongs to ONE user
- Each user can have MANY sessions
- If user is deleted → all their sessions are deleted
- Used for JWT token management
```

---

## 📤 What to Upload - Complete Checklist

### **Files to Upload (Total: 6 files, ~13 KB)**

```
STEP 1: Create folder
   Location: public_html/api/

STEP 2: Upload these 6 files:
   ✅ c:\Users\User\Downloads\TodoApp_Rhoen\api\config.php
   ✅ c:\Users\User\Downloads\TodoApp_Rhoen\api\login.php
   ✅ c:\Users\User\Downloads\TodoApp_Rhoen\api\register.php
   ✅ c:\Users\User\Downloads\TodoApp_Rhoen\api\profile.php
   ✅ c:\Users\User\Downloads\TodoApp_Rhoen\api\logout.php
   ✅ c:\Users\User\Downloads\TodoApp_Rhoen\api\.htaccess

STEP 3: Verify
   ✓ All files uploaded
   ✓ Permissions are 644
   ✓ API responds to requests
```

### **Do NOT Upload (Keep Private)**
```
❌ .env file (contains database credentials!)
❌ node_modules/ folder
❌ src/ or app/ folders (frontend code)
❌ package.json
❌ Any test files
```

---

## 📊 Table Relationships Summary

### **Visual Overview**

```
┌──────────────┐
│   USERS      │ ← Master table
├──────────────┤
│ id (PK)      │
│ name         │
│ email        │
│ password     │
│ dark_mode    │
│ created_at   │
└──────┬───────┘
       │
   ┌───┴─────────────────┐
   │                     │
   ↓ (1:∞)          ↓ (1:∞)
┌──────────┐    ┌──────────┐
│  TASKS   │    │  NOTES   │
├──────────┤    ├──────────┤
│ id       │    │ id       │
│ user_id→ │    │ user_id→ │
│ title    │    │ title    │
│ desc     │    │ content  │
└──────────┘    └──────────┘

   ↓ (1:∞)
┌──────────────┐
│  SESSIONS    │
├──────────────┤
│ id           │
│ user_id→     │
│ token        │
│ expires_at   │
└──────────────┘

Arrows (→) show Foreign Key references
All have CASCADE DELETE enabled
```

### **Indexes for Performance**

```
users.email      → Fast login lookup
tasks.user_id    → Fast task query per user
tasks.completed  → Fast filter completed tasks
notes.user_id    → Fast note query per user
sessions.token   → Fast token validation
sessions.user_id → Fast session lookup per user
```

---

## 🔐 Cascade Rules Explained

### **What is Cascade Delete?**

```
Normal situation:
└─ DELETE a user
   └─ Database refuses (has dependent tasks/notes)
   └─ Orphaned records remain

With Cascade Delete:
└─ DELETE a user
   └─ Automatically DELETE all their tasks
   └─ Automatically DELETE all their notes
   └─ Automatically DELETE all their sessions
   └─ Clean database, no orphans!
```

### **What is Cascade Update?**

```
Normal situation:
└─ UPDATE user ID from 5 → 10
   └─ Database refuses (child records have old ID)

With Cascade Update:
└─ UPDATE user ID from 5 → 10
   └─ Automatically UPDATE all tasks.user_id to 10
   └─ Automatically UPDATE all notes.user_id to 10
   └─ Automatically UPDATE all sessions.user_id to 10
   └─ All relationships maintained!
```

---

## 🚀 Upload Methods Comparison

### **Method 1: FTP (FileZilla/WinSCP) - RECOMMENDED**
```
Time: 2-3 minutes
Files: Upload all at once
Permissions: Easy to verify
Error handling: Good feedback
Best for: Multiple files, checking permissions
```

### **Method 2: File Manager (cPanel)**
```
Time: 3-5 minutes
Files: Upload one at a time or batch
Permissions: Set via UI
Error handling: Basic feedback
Best for: Simple deployment, no FTP knowledge
```

### **Method 3: SSH/Command Line**
```
Time: 1-2 minutes (if expert)
Files: Copy entire folder
Permissions: Automatic
Error handling: Terminal feedback
Best for: Advanced users, automation
```

---

## ✅ Pre-Deployment Verification

### **Before Uploading Files**
- [ ] Database created in InfinityFree
- [ ] Tables created from database.sql
- [ ] All 6 files exist locally
- [ ] .env file has correct credentials
- [ ] FTP credentials obtained

### **After Uploading Files**
- [ ] All 6 files visible in public_html/api/
- [ ] Files have 644 permissions
- [ ] API responds to POST requests
- [ ] Database connection successful
- [ ] Test signup/login working

---

## 🧪 Quick Test Commands

### **Test 1: Check if API folder exists**
```bash
curl -X GET https://to-do-listrhoen.infinityfreeapp.com/api/
Expected: Some response (even error is fine)
```

### **Test 2: Test login endpoint**
```bash
curl -X POST https://to-do-listrhoen.infinityfreeapp.com/api/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","appVersion":"1.1.0.0"}'
Expected: JSON response (with error message is OK - means API works!)
```

### **Test 3: Check database connection in phpMyAdmin**
```
1. Go to cPanel
2. Open phpMyAdmin
3. Check if tables exist: users, tasks, notes, sessions
4. Verify relationships in table properties
```

---

## 📋 Files Explained

### **config.php**
- Connects to MySQL database
- Generates and validates JWT tokens
- Provides CORS headers
- Helper functions for all endpoints

### **login.php**
- Endpoint: POST /api/login.php
- Validates user credentials
- Creates session in database
- Returns JWT token

### **register.php**
- Endpoint: POST /api/register.php
- Creates new user account
- Hashes password
- Creates initial session
- Returns JWT token

### **profile.php**
- Endpoint: GET/PATCH /api/profile.php
- GET: Returns user profile data
- PATCH: Updates name, dark_mode
- Requires valid JWT token

### **logout.php**
- Endpoint: POST /api/logout.php
- Deletes session from database
- Invalidates JWT token
- Returns success

### **.htaccess**
- Apache configuration
- Enables clean URLs
- Sets CORS headers
- Protects config.php

---

## 🎯 Quick Steps to Deploy

### **Step 1: Database (5 minutes)**
1. Login to InfinityFree cPanel
2. Open phpMyAdmin
3. Paste database.sql and execute

### **Step 2: Upload Files (2-3 minutes)**
1. Connect FTP
2. Create api/ folder in public_html/
3. Upload 6 files

### **Step 3: Test (2 minutes)**
1. Test API with curl
2. Test app signup/login
3. Verify database

### **Step 4: Done!**
1. App is ready to use
2. Users can signup/login
3. Data persists in database

---

## 📞 Common Issues

| Issue | Solution |
|-------|----------|
| API 404 error | Files not in public_html/api/ |
| Database error | Check .env credentials |
| Login fails | Verify user exists in database |
| Permission denied | Set file permissions to 644 |
| CORS error | Upload .htaccess file |

---

## 🎓 Learning Resources

### **Relationships & Foreign Keys**
- Read: [DATABASE_RELATIONSHIPS.md](DATABASE_RELATIONSHIPS.md)
- Visual: [VISUAL_GUIDE.md](VISUAL_GUIDE.md)

### **Upload Instructions**
- Quick: [FILES_TO_UPLOAD.md](FILES_TO_UPLOAD.md)
- Detailed: [INFINITYFREE_SETUP.md](INFINITYFREE_SETUP.md)

### **Full Implementation**
- Complete: [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md)
- Quick Start: [QUICKSTART.md](QUICKSTART.md)

---

## ✨ Summary

### **Database Relationships**
- ✅ Users → Tasks (1:Many)
- ✅ Users → Notes (1:Many)
- ✅ Users → Sessions (1:Many)
- ✅ CASCADE DELETE enabled
- ✅ CASCADE UPDATE enabled

### **Files to Upload**
- ✅ 6 files total (~13 KB)
- ✅ Location: public_html/api/
- ✅ Permissions: 644
- ✅ Ready to deploy

### **Status**
- ✅ Database schema complete
- ✅ API files ready
- ✅ Documentation complete
- ✅ Ready for InfinityFree deployment!

---

## 🚀 Next Steps

1. Review [DATABASE_RELATIONSHIPS.md](DATABASE_RELATIONSHIPS.md) to understand relationships
2. Follow [FILES_TO_UPLOAD.md](FILES_TO_UPLOAD.md) to upload files
3. Test API with curl command
4. Verify app can signup/login
5. Deploy app to production!

---

**Version**: 1.1.0.0  
**Last Updated**: June 5, 2026  
**Status**: ✅ READY FOR DEPLOYMENT

**For questions, see the documentation files listed above!**
