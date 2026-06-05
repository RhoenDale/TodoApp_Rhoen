# 📋 InfinityFree Upload Checklist - Files List

## ✅ Complete File List for Upload

### **Files in `/api/` folder to upload to InfinityFree:**

```
✅ REQUIRED FILES (5 PHP files):
   1. config.php        - Database connection & JWT functions
   2. login.php         - User login endpoint
   3. register.php      - User registration endpoint  
   4. profile.php       - Get/update user profile
   5. logout.php        - User logout endpoint

⚠️  OPTIONAL BUT RECOMMENDED:
   6. .htaccess        - Apache rewrite rules & security headers
```

---

## 🎯 Upload Destination

```
InfinityFree Directory Structure:
├── public_html/
│   ├── index.html (your main site)
│   ├── api/                    ← CREATE THIS FOLDER
│   │   ├── config.php          ← UPLOAD
│   │   ├── login.php           ← UPLOAD
│   │   ├── register.php        ← UPLOAD
│   │   ├── profile.php         ← UPLOAD
│   │   ├── logout.php          ← UPLOAD
│   │   └── .htaccess           ← UPLOAD
│   └── ... other files
```

---

## 📊 File Details

| # | File Name | Size | Type | Must Upload |
|---|-----------|------|------|------------|
| 1 | `config.php` | ~3 KB | Core Config | ✅ YES |
| 2 | `login.php` | ~2 KB | Endpoint | ✅ YES |
| 3 | `register.php` | ~2.5 KB | Endpoint | ✅ YES |
| 4 | `profile.php` | ~3.5 KB | Endpoint | ✅ YES |
| 5 | `logout.php` | ~1.5 KB | Endpoint | ✅ YES |
| 6 | `.htaccess` | ~0.5 KB | Config | ⚠️ OPTIONAL |

**Total Size**: ~13 KB

---

## 🚀 Upload Instructions (3 Easy Steps)

### **Step 1: Connect to InfinityFree**
```
Method A - Using FTP:
  Host: sql200.infinityfree.com
  Username: if0_42037620
  Password: j3fqZZHBekAEF
  
Method B - Using File Manager:
  Go to: cPanel → File Manager
```

### **Step 2: Create API Folder**
```
Navigate to: public_html/
Right-click → Create New Folder
Folder name: api
Press Create
```

### **Step 3: Upload Files**
```
Open: public_html/api/
Upload all 6 files from your local c:\Users\User\Downloads\TodoApp_Rhoen\api\
```

---

## ✨ What Each File Does

### **1. config.php** 🔧
- Connects to MySQL database
- Generates JWT tokens
- Decodes & validates tokens
- Provides helper functions
- Handles CORS headers

### **2. login.php** 🔓
- Receives: email, password
- Validates credentials
- Generates JWT token
- Creates session record
- Returns: token + user data

### **3. register.php** ✍️
- Receives: name, email, password
- Validates input
- Creates user account
- Hashes password (bcrypt)
- Generates JWT token
- Returns: token + user data

### **4. profile.php** 👤
- **GET**: Returns user profile
- **PATCH**: Updates user profile (name, darkMode)
- Requires valid JWT token
- Prevents unauthorized access

### **5. logout.php** 🚪
- Invalidates JWT token
- Deletes session record
- Returns success message
- Requires valid JWT token

### **6. .htaccess** ⚙️
- Enables clean URLs
- Adds security headers
- Protects config.php
- Handles CORS preflight

---

## 📱 API Endpoints After Upload

Once uploaded, your API will be available at:

```
Base URL: https://to-do-listrhoen.infinityfreeapp.com/api/

Endpoints:
POST   /login.php       - User login
POST   /register.php    - User registration
GET    /profile.php     - Get user profile
PATCH  /profile.php     - Update user profile
POST   /logout.php      - User logout
```

---

## 🧪 Quick Test After Upload

### **Test if API is working:**
```bash
curl -X POST https://to-do-listrhoen.infinityfreeapp.com/api/login.php \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "appVersion": "1.1.0.0"
  }'
```

### **Expected response:**
```json
{
  "message": "Invalid email or password"
}
```
(or similar - means API is working!)

---

## ⚠️ Important Notes

### **DO NOT Upload:**
- ❌ `.env` file (keep it private!)
- ❌ `node_modules/` folder
- ❌ `.git/` folder
- ❌ `package.json` or `package-lock.json`
- ❌ Any frontend React/Expo code

### **DO Upload (to api/ folder only):**
- ✅ All `.php` files
- ✅ `.htaccess` file
- ✅ Nothing else!

### **Permissions:**
- All `.php` files should have: `644` permissions
- `.htaccess` should have: `644` permissions

---

## 🔒 File Permissions

After upload, verify permissions:

```
FTP Client (FileZilla):
  Right-click each file → File permissions
  Set to: 644
  
File Manager:
  Check → File permissions show 644
```

---

## 📍 Local File Locations

Your files are here:

```
Windows Path:
C:\Users\User\Downloads\TodoApp_Rhoen\api\

Files to upload:
├── C:\Users\User\Downloads\TodoApp_Rhoen\api\config.php
├── C:\Users\User\Downloads\TodoApp_Rhoen\api\login.php
├── C:\Users\User\Downloads\TodoApp_Rhoen\api\register.php
├── C:\Users\User\Downloads\TodoApp_Rhoen\api\profile.php
├── C:\Users\User\Downloads\TodoApp_Rhoen\api\logout.php
└── C:\Users\User\Downloads\TodoApp_Rhoen\api\.htaccess
```

---

## ✅ Pre-Upload Checklist

Before uploading, verify:

- [ ] All 6 files exist in your local api/ folder
- [ ] InfinityFree account credentials ready
- [ ] Database already created in InfinityFree
- [ ] Database tables created from database.sql
- [ ] .env file has correct credentials
- [ ] You know your API base URL

---

## ✅ Post-Upload Checklist

After uploading, verify:

- [ ] All 6 files uploaded to public_html/api/
- [ ] Files are readable (644 permissions)
- [ ] API responds to test curl command
- [ ] No 404 errors
- [ ] Database connection working
- [ ] App can reach API endpoints

---

## 🆘 Troubleshooting

### Issue: API returns 404
**Solution**: Check files are in public_html/api/ folder

### Issue: Database connection error
**Solution**: Verify DB credentials in .env match InfinityFree

### Issue: CORS error in app
**Solution**: .htaccess file missing - upload it

### Issue: "PHP not enabled"
**Solution**: Contact InfinityFree support - PHP should be enabled

---

## 📞 Support

If you have issues:

1. Check [DATABASE_RELATIONSHIPS.md](DATABASE_RELATIONSHIPS.md)
2. Check [INFINITYFREE_SETUP.md](INFINITYFREE_SETUP.md)
3. Check [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md)
4. Contact InfinityFree support

---

## 🎉 Summary

**6 files to upload to: `public_html/api/`**

```
✅ config.php       (Core database & JWT)
✅ login.php        (Login endpoint)
✅ register.php     (Signup endpoint)
✅ profile.php      (Profile endpoint)
✅ logout.php       (Logout endpoint)
✅ .htaccess        (Security & routing)
```

**Total**: ~13 KB  
**Time**: 2-3 minutes  
**Status**: Ready to upload! ✓

---

**Next Step**: Follow upload instructions above!
