#!/usr/bin/env python3
"""
Database setup for Sellers Pro
Using SQLite for simplicity
"""

import sqlite3
import json
from datetime import datetime

class Database:
    def __init__(self, db_path='/tmp/sellers_pro.db'):
        self.db_path = db_path
        self.init_database()
    
    def get_connection(self):
        return sqlite3.connect(self.db_path)
    
    def init_database(self):
        """Create all tables"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                telegram_id TEXT UNIQUE NOT NULL,
                first_name TEXT,
                last_name TEXT,
                username TEXT,
                phone_number TEXT,
                subscription_type TEXT DEFAULT 'basic',
                subscription_active INTEGER DEFAULT 0,
                subscription_start DATE,
                subscription_end DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP
            )
        ''')
        
        # OTPs table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS otps (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                telegram_id TEXT NOT NULL,
                code TEXT NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                used INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Lesson progress table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS lesson_progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                lesson_id INTEGER NOT NULL,
                completed INTEGER DEFAULT 0,
                completed_at TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                UNIQUE(user_id, lesson_id)
            )
        ''')
        
        # Login history table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS login_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ip_address TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ''')
        
        # Sessions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                token TEXT UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        ''')

        # Lessons table (store lesson metadata and downloadable resources)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS lessons (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                intro TEXT,
                video_id TEXT,
                summary TEXT,
                resources TEXT, -- JSON array of {name,url}
                downloads TEXT, -- JSON array of {name,url}
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        print("✅ Database initialized successfully")
    
    def add_user(self, telegram_id, first_name, last_name=None, username=None, phone_number=None):
        """Add or update user"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO users (telegram_id, first_name, last_name, username, phone_number)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(telegram_id) DO UPDATE SET
                    first_name=excluded.first_name,
                    last_name=excluded.last_name,
                    username=excluded.username,
                    phone_number=excluded.phone_number,
                    last_login=CURRENT_TIMESTAMP
            ''', (telegram_id, first_name, last_name, username, phone_number))
            
            conn.commit()
            user_id = cursor.lastrowid or cursor.execute(
                'SELECT id FROM users WHERE telegram_id=?', (telegram_id,)
            ).fetchone()[0]
            
            conn.close()
            return user_id
        except Exception as e:
            conn.close()
            print(f"Error adding user: {e}")
            return None

    # --- Lessons management ---
    def create_or_update_lesson(self, lesson_id, title, intro=None, video_id=None, summary=None, resources=None, downloads=None):
        """Create or update a lesson. resources and downloads should be lists and will be stored as JSON."""
        conn = self.get_connection()
        cursor = conn.cursor()
        import json

        resources_json = json.dumps(resources or [])
        downloads_json = json.dumps(downloads or [])

        cursor.execute('''
            INSERT INTO lessons (id, title, intro, video_id, summary, resources, downloads)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                title=excluded.title,
                intro=excluded.intro,
                video_id=excluded.video_id,
                summary=excluded.summary,
                resources=excluded.resources,
                downloads=excluded.downloads
        ''', (lesson_id, title, intro, video_id, summary, resources_json, downloads_json))

        conn.commit()
        conn.close()

    def get_all_lessons(self):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, title, intro, video_id, summary, resources, downloads, created_at
            FROM lessons
            ORDER BY id
        ''')
        rows = cursor.fetchall()
        conn.close()

        import json
        lessons = []
        for r in rows:
            lessons.append({
                'id': r[0],
                'title': r[1],
                'intro': r[2],
                'video_id': r[3],
                'summary': r[4],
                'resources': json.loads(r[5]) if r[5] else [],
                'downloads': json.loads(r[6]) if r[6] else [],
                'created_at': r[7]
            })
        return lessons

    def get_lesson(self, lesson_id):
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, title, intro, video_id, summary, resources, downloads, created_at
            FROM lessons
            WHERE id = ?
        ''', (lesson_id,))
        r = cursor.fetchone()
        conn.close()
        if not r:
            return None
        import json
        return {
            'id': r[0],
            'title': r[1],
            'intro': r[2],
            'video_id': r[3],
            'summary': r[4],
            'resources': json.loads(r[5]) if r[5] else [],
            'downloads': json.loads(r[6]) if r[6] else [],
            'created_at': r[7]
        }
    
    def add_otp(self, telegram_id, code, expires_at):
        """Add OTP code"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO otps (telegram_id, code, expires_at)
            VALUES (?, ?, ?)
        ''', (telegram_id, code, expires_at))
        
        conn.commit()
        conn.close()
    
    def verify_otp(self, code):
        """Verify OTP and return user info"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT o.telegram_id, u.id, u.first_name, u.last_name, u.subscription_type, u.subscription_active
            FROM otps o
            JOIN users u ON o.telegram_id = u.telegram_id
            WHERE o.code = ? AND o.used = 0 AND o.expires_at > datetime('now')
        ''', (code,))
        
        result = cursor.fetchone()
        
        if result:
            # Mark OTP as used
            cursor.execute('''
                UPDATE otps SET used = 1 WHERE code = ?
            ''', (code,))
            conn.commit()
        
        conn.close()
        return result
    
    def get_user_progress(self, user_id):
        """Get user's lesson progress"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT lesson_id, completed, completed_at
            FROM lesson_progress
            WHERE user_id = ?
            ORDER BY lesson_id
        ''', (user_id,))
        
        progress = cursor.fetchall()
        conn.close()
        
        return [
            {
                'lessonId': p[0],
                'completed': bool(p[1]),
                'completedAt': p[2]
            } for p in progress
        ]
    
    def update_lesson_progress(self, user_id, lesson_id, completed=True):
        """Update lesson progress"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO lesson_progress (user_id, lesson_id, completed, completed_at)
            VALUES (?, ?, ?, datetime('now'))
            ON CONFLICT(user_id, lesson_id) DO UPDATE SET
                completed=excluded.completed,
                completed_at=excluded.completed_at
        ''', (user_id, lesson_id, 1 if completed else 0))
        
        conn.commit()
        conn.close()
    
    def get_all_users(self):
        """Get all users for admin panel"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                id, telegram_id, first_name, last_name, username, phone_number,
                subscription_type, subscription_active, created_at, last_login
            FROM users
            ORDER BY created_at DESC
        ''')
        
        users = cursor.fetchall()
        conn.close()
        
        return users
    
    def get_stats(self):
        """Get platform statistics"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Total users
        cursor.execute('SELECT COUNT(*) FROM users')
        total_users = cursor.fetchone()[0]
        
        # Active subscriptions
        cursor.execute('SELECT COUNT(*) FROM users WHERE subscription_active = 1')
        active_subs = cursor.fetchone()[0]
        
        # Total logins today
        cursor.execute('''
            SELECT COUNT(*) FROM login_history 
            WHERE DATE(login_time) = DATE('now')
        ''')
        logins_today = cursor.fetchone()[0]
        
        # Completed lessons
        cursor.execute('SELECT COUNT(*) FROM lesson_progress WHERE completed = 1')
        completed_lessons = cursor.fetchone()[0]
        
        conn.close()
        
        return {
            'total_users': total_users,
            'active_subscriptions': active_subs,
            'logins_today': logins_today,
            'completed_lessons': completed_lessons
        }
    
    def create_session(self, user_id, token, expires_at):
        """Create user session"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO sessions (user_id, token, expires_at)
            VALUES (?, ?, ?)
        ''', (user_id, token, expires_at))
        
        conn.commit()
        conn.close()
    
    def log_login(self, user_id, ip_address=None):
        """Log user login"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO login_history (user_id, ip_address)
            VALUES (?, ?)
        ''', (user_id, ip_address))
        
        cursor.execute('''
            UPDATE users SET last_login = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (user_id,))
        
        conn.commit()
        conn.close()

    def update_subscription(self, user_id, subscription_type, days, active):
        """Update user subscription"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        from datetime import datetime, timedelta
        
        start_date = datetime.now()
        end_date = start_date + timedelta(days=days)
        
        cursor.execute('''
            UPDATE users 
            SET subscription_type = ?,
                subscription_active = ?,
                subscription_start = ?,
                subscription_end = ?
            WHERE id = ?
        ''', (subscription_type, 1 if active else 0, start_date.isoformat(), end_date.isoformat(), user_id))
        
        conn.commit()
        conn.close()
        return True

if __name__ == '__main__':
    db = Database()
    print("Database setup complete!")
    print(f"Database location: {db.db_path}")
