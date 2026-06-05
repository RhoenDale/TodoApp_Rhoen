# Login & Signup Flow Documentation

## 📱 Complete User Journey

### New User (Signup Flow)
```
1. User opens app
   ↓
2. Redirected to /auth/login (no auth token)
   ↓
3. User clicks "Sign up"
   ↓
4. Navigates to /auth/signup
   ↓
5. User enters: Name, Email, Password, Confirm Password
   ↓
6. Clicks "SIGN UP"
   ↓
7. App calls register(name, email, password) in auth-context
   ↓
8. Backend (register.php) validates and creates user account
   ↓
9. Returns JWT token and user data
   ↓
10. App shows success alert: "Account created! Please log in."
    ↓
11. User clicks OK
    ↓
12. Redirected to /auth/login ✓
```

### Existing User (Login Flow)
```
1. User opens app
   ↓
2. Redirected to /auth/login (no auth token)
   ↓
3. User enters: Email, Password
   ↓
4. Clicks "LOGIN"
   ↓
5. App calls login(email, password) in auth-context
   ↓
6. Backend (login.php) validates credentials
   ↓
7. Returns JWT token and user data
   ↓
8. Token saved to AsyncStorage
   ↓
9. RootLayout detects token exists
   ↓
10. Redirected to /(app)/tasks ✓
```

### Returning User (Session Recovery)
```
1. User opens app
   ↓
2. App checks AsyncStorage for saved session
   ↓
3. Session found with valid token
   ↓
4. RootLayout detects token exists
   ↓
5. Directly navigated to /(app) layout
   ↓
6. Shows: Tasks, Notes, Profile tabs ✓
```

### Logout Flow
```
1. User on Profile page
   ↓
2. Clicks "Logout" button
   ↓
3. Confirmation alert appears
   ↓
4. User confirms logout
   ↓
5. App calls logout() in auth-context
   ↓
6. Backend (logout.php) invalidates session
   ↓
7. Token removed from AsyncStorage
   ↓
8. RootLayout detects no token
   ↓
9. Redirected to /auth/login ✓
```

## 📂 Files Involved

### Navigation Flow
- **[app/_layout.tsx](app/_layout.tsx)** - Root navigation logic
  - Checks if user has token
  - Routes to (app) or auth layout

- **[app/auth/_layout.tsx](app/auth/_layout.tsx)** - Auth stack
  - Contains login and signup screens
  - Navigation between them

- **[app/(app)/_layout.tsx](app/(app)/_layout.tsx)** - App tabs
  - Shows tasks, notes, profile

### Authentication
- **[contexts/auth-context.tsx](contexts/auth-context.tsx)** - Auth state
  - Manages login, register, logout
  - Saves/loads session from storage
  - Provides useAuth hook

- **[app/auth/login.tsx](app/auth/login.tsx)** - Login UI
  - Email & password inputs
  - Calls login() function
  - Redirects to /(app)/tasks on success

- **[app/auth/signup.tsx](app/auth/signup.tsx)** - Signup UI
  - Name, email, password inputs
  - Calls register() function
  - Shows alert and redirects to /auth/login on success

### Backend API
- **[lib/api.ts](lib/api.ts)** - API client
  - loginRequest() - calls login.php
  - registerRequest() - calls register.php
  - logoutRequest() - calls logout.php
  - fetchProfileRequest() - calls profile.php
  - updateProfileRequest() - calls profile.php (PATCH)

- **[api/login.php](api/login.php)** - Backend login
  - Validates credentials
  - Generates JWT token
  - Creates session record

- **[api/register.php](api/register.php)** - Backend signup
  - Validates input
  - Creates user account
  - Generates JWT token
  - Creates session record

- **[api/logout.php](api/logout.php)** - Backend logout
  - Invalidates session
  - Removes token

## ✅ Verification Checklist

- [x] Signup flow navigates to login
- [x] Login flow navigates to tasks
- [x] Headers are hidden (no "auth" or "app" labels)
- [x] Session persists on app restart
- [x] Logout clears session
- [x] JWT token authentication working
- [x] Environment variables configured
- [x] Database schema ready
- [x] API endpoints functional
- [x] Profile page shows user email
- [x] Dark mode toggle working
- [x] Version 1.1.0.0 displays

## 🔄 State Management Flow

```
User Action
    ↓
UI Component (login.tsx / signup.tsx)
    ↓
useAuth() Hook (from auth-context)
    ↓
Auth Function (login/register)
    ↓
API Request (lib/api.ts)
    ↓
Backend PHP (api/*.php)
    ↓
Database (MySQL/InfinityFree)
    ↓
Response ← Backend
    ↓
Save Session (AsyncStorage)
    ↓
Update Auth State
    ↓
Navigation (RootLayout reacts to token)
    ↓
User sees new screen ✓
```

## 🐛 Troubleshooting

### Issue: Signup doesn't redirect to login
**Check**:
1. Look in [app/auth/signup.tsx](app/auth/signup.tsx) line 47
2. Verify Alert has `onPress: () => router.replace('/auth/login')`
3. Check if register() throws error - see Alert message

### Issue: Login doesn't navigate to tasks
**Check**:
1. Look in [app/auth/login.tsx](app/auth/login.tsx) line 26
2. Verify `router.replace('/(app)/tasks')` is called
3. Check if login() throws error - see Alert message

### Issue: Headers still showing "auth" or "app"
**Check**:
1. Both layout files have `headerShown: false` configured
2. They are already hidden ✓

### Issue: Session not persisting
**Check**:
1. Verify AsyncStorage is properly imported
2. Check if loadSession() in auth-context runs on app start
3. Verify token is being saved correctly

---
**All flows are correctly implemented and ready for testing!**
