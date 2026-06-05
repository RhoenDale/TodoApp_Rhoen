# ✅ Deployment Checklist - Print & Follow

## 📋 Pre-Deployment Checklist

### **Phase 1: Preparation (5 minutes)**
- [ ] Have InfinityFree credentials ready
- [ ] Know your domain (e.g., to-do-listrhoen.infinityfreeapp.com)
- [ ] Have FTP client installed (FileZilla, WinSCP)
- [ ] Locate local api/ folder: `C:\Users\User\Downloads\TodoApp_Rhoen\api\`

### **Phase 2: Database Setup (10 minutes)**
- [ ] Login to InfinityFree cPanel
- [ ] Open phpMyAdmin
- [ ] Database already exists: `if0_42037620_todoapp` ✓
- [ ] In SQL tab, copy and paste entire `database.sql`
- [ ] Click Execute/Go
- [ ] Verify 4 tables created:
  - [ ] users
  - [ ] tasks
  - [ ] notes
  - [ ] sessions
- [ ] Check relationships in each table

### **Phase 3: File Upload (5-10 minutes)**
- [ ] Connect to InfinityFree via FTP
  - Host: `sql200.infinityfree.com`
  - User: `if0_42037620`
  - Password: (from .env file)
- [ ] Navigate to: `public_html/`
- [ ] Create new folder: `api`
- [ ] Open `api/` folder
- [ ] Upload these 6 files:
  - [ ] config.php (from `C:\Users\User\Downloads\TodoApp_Rhoen\api\`)
  - [ ] login.php
  - [ ] register.php
  - [ ] profile.php
  - [ ] logout.php
  - [ ] .htaccess
- [ ] Verify all 6 files uploaded
- [ ] Set permissions to 644:
  - [ ] config.php → 644
  - [ ] login.php → 644
  - [ ] register.php → 644
  - [ ] profile.php → 644
  - [ ] logout.php → 644
  - [ ] .htaccess → 644

### **Phase 4: Testing (5-10 minutes)**
- [ ] Test API connection:
  ```bash
  curl -X POST https://to-do-listrhoen.infinityfreeapp.com/api/login.php \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test123","appVersion":"1.1.0.0"}'
  ```
  Expected: JSON response (error is OK)

- [ ] Test in app:
  - [ ] Open TodoApp
  - [ ] Try signup with new email
  - [ ] Verify success message
  - [ ] Verify redirects to login
  - [ ] Try login with credentials
  - [ ] Verify redirects to tasks page
  - [ ] Go to profile
  - [ ] Verify email displays
  - [ ] Verify version shows 1.1.0.0
  - [ ] Toggle dark mode
  - [ ] Verify theme changes
  - [ ] Logout

### **Phase 5: Database Verification (5 minutes)**
- [ ] Open phpMyAdmin
- [ ] Check users table:
  - [ ] Your test user exists
  - [ ] Email is correct
  - [ ] Password is hashed
  - [ ] created_at timestamp present
- [ ] Check sessions table:
  - [ ] Session record created for your user
  - [ ] Token is stored
  - [ ] expires_at is set
- [ ] Verify relationships:
  - [ ] user_id in tasks points to valid user
  - [ ] user_id in notes points to valid user
  - [ ] user_id in sessions points to valid user

---

## 📊 Database Relationships Quick Reference

```
USERS (Master)
  ↓ FK: user_id
  ├─ TASKS    (1:Many) - Each user has many tasks
  ├─ NOTES    (1:Many) - Each user has many notes
  └─ SESSIONS (1:Many) - Each user has many sessions

Cascade Rules:
  • Delete user → Delete all their tasks, notes, sessions
  • Update user ID → Update all child table user_id values
```

---

## 📤 Files to Upload - Quick Checklist

### **Location to Upload To:**
```
InfinityFree → public_html/ → api/
```

### **Files (6 Total):**
```
✅ config.php       - Core database & JWT
✅ login.php        - Login endpoint
✅ register.php     - Registration endpoint
✅ profile.php      - Profile endpoint
✅ logout.php       - Logout endpoint
✅ .htaccess        - Security & routing
```

### **Total Size:** ~13 KB

---

## 🧪 Testing Checklist

### **API Tests:**
- [ ] Login endpoint responds
- [ ] Register endpoint responds
- [ ] Profile endpoint requires auth token
- [ ] Logout endpoint invalidates token

### **App Tests:**
- [ ] Signup creates account
- [ ] Signup redirects to login
- [ ] Login with valid credentials works
- [ ] Login redirects to tasks page
- [ ] Profile shows user email
- [ ] Profile shows version 1.1.0.0
- [ ] Dark mode toggle works
- [ ] Logout clears session

### **Database Tests:**
- [ ] User created in users table
- [ ] Session created in sessions table
- [ ] Foreign keys are correct
- [ ] Timestamps are accurate
- [ ] No orphaned records

---

## 🔗 Documentation Files

| Document | Read If... |
|----------|-----------|
| [MASTER_REFERENCE.md](MASTER_REFERENCE.md) | Want complete overview |
| [DATABASE_RELATIONSHIPS.md](DATABASE_RELATIONSHIPS.md) | Want to understand relationships |
| [FILES_TO_UPLOAD.md](FILES_TO_UPLOAD.md) | Need detailed upload steps |
| [VISUAL_GUIDE.md](VISUAL_GUIDE.md) | Visual learner |
| [INFINITYFREE_SETUP.md](INFINITYFREE_SETUP.md) | Need full deployment guide |

---

## 🆘 Troubleshooting Quick Fix

| Problem | Fix |
|---------|-----|
| API returns 404 | Files not in public_html/api/ folder |
| Database error | Check .env credentials match InfinityFree |
| Login fails | Verify user exists in database |
| Dark mode doesn't save | Check database connection is working |
| CORS error | Upload .htaccess file |
| Signup doesn't work | Check register.php is uploaded |

---

## 📝 Important Notes

### **Credentials (In .env):**
```
DB_HOST=sql200.infinityfree.com
DB_NAME=if0_42037620_todoapp
DB_USER=if0_42037620
DB_PASSWORD=j3fqZZHBekAEF
```

### **API URL:**
```
https://to-do-listrhoen.infinityfreeapp.com/api/
```

### **Don't Forget:**
- ✓ Upload .htaccess file (includes CORS headers)
- ✓ Set file permissions to 644
- ✓ Test API before testing in app
- ✓ Create api/ folder (don't upload to public_html root)

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Prepare (get credentials) | 2 min |
| Create database tables | 3 min |
| Upload files via FTP | 3-5 min |
| Test API | 2 min |
| Test in app | 5 min |
| Verify database | 3 min |
| **Total** | **18-20 min** |

---

## ✨ What Gets Deployed

### **What We Upload:**
- ✅ 6 API files to public_html/api/
- ✅ Database schema (via phpMyAdmin)
- ✅ .env configuration

### **What We DON'T Upload:**
- ❌ Frontend app code (stays on your device/app stores)
- ❌ .env file (keep secure!)
- ❌ node_modules or build files
- ❌ .git or development files

---

## 🎉 Success Indicators

After deployment, you should see:

```
✅ User can sign up
✅ New user created in database with hashed password
✅ User redirects to login page
✅ User can login with credentials
✅ User gets JWT token
✅ Session record created in database
✅ User redirects to tasks page
✅ User profile shows email and version
✅ Dark mode toggle works
✅ Logout clears session
✅ User redirects back to login
```

---

## 📞 Quick Support

### **If API returns error:**
1. Check files are uploaded to public_html/api/
2. Check file permissions (644)
3. Check .env credentials
4. Test directly: curl command from troubleshooting

### **If database error:**
1. Verify database exists in phpMyAdmin
2. Verify tables are created
3. Check credentials in .env match InfinityFree
4. Try creating a test user in phpMyAdmin

### **If app can't connect:**
1. Check API URL in .env
2. Verify .htaccess is uploaded
3. Check CORS headers in .htaccess
4. Test API with curl first

---

## 🚀 Final Checklist Before Going Live

- [ ] All tests passed
- [ ] Database has test data
- [ ] API responds correctly
- [ ] App can signup/login
- [ ] Profile displays correctly
- [ ] Dark mode works
- [ ] No errors in console
- [ ] Ready to announce deployment!

---

## 📋 Sign-Off

**Deployment Checklist Completed By:** _______________

**Date:** _______________

**Status:** 
- [ ] Development
- [ ] Testing  
- [ ] Staging
- [ ] **Production** ✓

---

**Version**: 1.1.0.0  
**Updated**: June 5, 2026  
**Status**: ✅ Ready for Deployment

### **Next Step**: Follow this checklist from Phase 1!
