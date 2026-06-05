-- TodoApp Database Schema
-- Compatible with MySQL/InfinityFree
-- Database Relationships:
--   users (1) ──→ (∞) tasks [user_id FK → users.id]
--   users (1) ──→ (∞) notes [user_id FK → users.id]
--   users (1) ──→ (∞) sessions [user_id FK → users.id]
-- ON DELETE CASCADE: Deleting a user deletes all related tasks, notes, and sessions

-- ============================================
-- 1. USERS TABLE - Core user data
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  dark_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP NULL,
  INDEX idx_email (email),
  CONSTRAINT uk_users_email UNIQUE KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. TASKS TABLE - Related to users (1:Many)
-- ============================================
-- Relationship: Each task belongs to ONE user
-- Foreign Key: user_id → users.id (ON DELETE CASCADE)
-- ============================================
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
  INDEX idx_completed (completed),
  CONSTRAINT fk_tasks_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. NOTES TABLE - Related to users (1:Many)
-- ============================================
-- Relationship: Each note belongs to ONE user
-- Foreign Key: user_id → users.id (ON DELETE CASCADE)
-- ============================================
CREATE TABLE IF NOT EXISTS notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  CONSTRAINT fk_notes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. SESSIONS TABLE - Related to users (1:Many)
-- ============================================
-- Relationship: Each session belongs to ONE user
-- Foreign Key: user_id → users.id (ON DELETE CASCADE)
-- Purpose: Store JWT tokens and manage user sessions
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_token (token),
  INDEX idx_expires_at (expires_at),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- RELATIONSHIPS SUMMARY
-- ============================================
-- users.id (PK) → tasks.user_id (FK) - One user has many tasks
-- users.id (PK) → notes.user_id (FK) - One user has many notes
-- users.id (PK) → sessions.user_id (FK) - One user has many sessions
--
-- CASCADE Rules:
-- - ON DELETE CASCADE: When a user is deleted, all their tasks, notes, and sessions are deleted
-- - ON UPDATE CASCADE: When a user ID is updated, all related records are updated
--
-- Indexes for Performance:
-- - idx_email: Fast lookup by email for login
-- - idx_user_id: Fast lookup of tasks/notes/sessions by user
-- - idx_completed: Fast filtering of completed tasks
-- - idx_token: Fast session lookup by token
-- - idx_expires_at: Fast cleanup of expired sessions
-- ============================================
