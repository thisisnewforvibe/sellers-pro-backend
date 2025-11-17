#!/usr/bin/env python3
"""
API Server for OTP verification
Works with Telegram bot and SQLite database
"""

import http.server
import socketserver
import json
import time
from datetime import datetime, timedelta
from urllib.parse import parse_qs
from database import Database

# Initialize database
db = Database()

class OTPHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/auth/verify-otp':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                otp = data.get('otp')
                
                # Verify OTP using database
                result = db.verify_otp(otp)
                
                if result:
                    telegram_id, user_id, first_name, last_name, sub_type, sub_active = result
                    
                    # Create session token
                    token = f"token_{user_id}_{int(time.time())}"
                    expires_at = (datetime.now() + timedelta(days=30)).isoformat()
                    db.create_session(user_id, token, expires_at)
                    
                    # Log login
                    db.log_login(user_id)
                    
                    # Get user progress
                    progress = db.get_user_progress(user_id)
                    
                    response = {
                        "success": True,
                        "message": "Muvaffaqiyatli!",
                        "token": token,
                        "user": {
                            "id": user_id,
                            "firstName": first_name,
                            "lastName": last_name,
                            "subscription": {
                                "type": sub_type,
                                "active": bool(sub_active)
                            },
                            "progress": progress
                        }
                    }
                    self.send_response(200)
                else:
                    response = {
                        "success": False,
                        "message": "Noto'g'ri yoki muddati o'tgan kod"
                    }
                    self.send_response(401)
                
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
                
            except Exception as e:
                print(f"Error: {e}")
                self.send_error(500)
        
        elif self.path.startswith('/api/lessons/complete/'):
            # Mark lesson as completed
            try:
                lesson_id = int(self.path.split('/')[-1])
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                
                # Get token from headers
                auth_header = self.headers.get('Authorization', '')
                token = auth_header.replace('Bearer ', '')
                
                if token:
                    # Get user from session
                    conn = db.get_connection()
                    cursor = conn.cursor()
                    cursor.execute('''
                        SELECT user_id FROM sessions 
                        WHERE token = ? AND expires_at > datetime('now')
                    ''', (token,))
                    result = cursor.fetchone()
                    conn.close()
                    
                    if result:
                        user_id = result[0]
                        db.update_lesson_progress(user_id, lesson_id, True)
                        
                        response = {
                            "success": True,
                            "message": "Dars yakunlandi"
                        }
                        self.send_response(200)
                    else:
                        response = {"success": False, "message": "Token noto'g'ri"}
                        self.send_response(401)
                else:
                    response = {"success": False, "message": "Token topilmadi"}
                    self.send_response(401)
                
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
                
            except Exception as e:
                print(f"Error: {e}")
                self.send_error(500)
        
        elif self.path.startswith('/api/admin/subscription/'):
            # Update user subscription
            try:
                user_id = int(self.path.split('/')[-1])
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                subscription_type = data.get('subscription_type', 'basic')
                days = int(data.get('days', 30))
                active = data.get('active', True)
                
                db.update_subscription(user_id, subscription_type, days, active)
                
                response = {
                    "success": True,
                    "message": "Obuna muvaffaqiyatli yangilandi"
                }
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
                
            except Exception as e:
                print(f"Error updating subscription: {e}")
                response = {
                    "success": False,
                    "message": str(e)
                }
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
        
        elif self.path.startswith('/api/admin/lesson'):
            # Create or update lesson metadata
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
                data = json.loads(post_data.decode('utf-8'))

                # Required fields: id, title
                lesson_id = int(data.get('id'))
                title = data.get('title')
                if not lesson_id or not title:
                    raise ValueError('Lesson id and title are required')

                intro = data.get('intro')
                video_id = data.get('video_id')
                summary = data.get('summary')
                resources = data.get('resources', [])
                downloads = data.get('downloads', [])

                db.create_or_update_lesson(lesson_id, title, intro, video_id, summary, resources, downloads)

                response = { 'success': True, 'message': 'Lesson saved' }
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())

            except Exception as e:
                print(f"Error saving lesson: {e}")
                response = { 'success': False, 'message': str(e) }
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
        else:
            self.send_error(404)
    
    def do_GET(self):
        if self.path == '/api/admin/stats':
            # Get platform statistics
            try:
                stats = db.get_stats()
                response = stats
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
                
            except Exception as e:
                print(f"Error getting stats: {e}")
                self.send_error(500)
        
        elif self.path.startswith('/api/admin/users'):
            # Get all users with optional limit
            try:
                # Parse query parameters
                limit = None
                if '?' in self.path:
                    query_string = self.path.split('?')[1]
                    params = parse_qs(query_string)
                    if 'limit' in params:
                        limit = int(params['limit'][0])
                
                conn = db.get_connection()
                cursor = conn.cursor()
                
                query = '''
                    SELECT id, telegram_id, first_name, last_name, username, phone_number,
                           subscription_type, subscription_active, subscription_start, 
                           subscription_end, created_at, last_login
                    FROM users
                    ORDER BY created_at DESC
                '''
                if limit:
                    query += f' LIMIT {limit}'
                
                cursor.execute(query)
                users = cursor.fetchall()
                conn.close()
                
                response = []
                for user in users:
                    response.append({
                        'id': user[0],
                        'telegram_id': user[1],
                        'first_name': user[2],
                        'last_name': user[3],
                        'username': user[4],
                        'phone_number': user[5],
                        'subscription_type': user[6],
                        'subscription_active': user[7],
                        'subscription_start': user[8],
                        'subscription_end': user[9],
                        'created_at': user[10],
                        'last_login': user[11]
                    })
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
                
            except Exception as e:
                print(f"Error getting users: {e}")
                self.send_error(500)
        
        elif self.path.startswith('/api/lessons'):
            # Public endpoint to list lessons or get a single lesson
            try:
                # /api/lessons or /api/lessons/{id}
                path_clean = self.path.split('?')[0]  # Remove query params
                parts = [p for p in path_clean.split('/') if p]  # Split and remove empty
                
                # parts will be ['api', 'lessons'] or ['api', 'lessons', 'ID']
                if len(parts) == 2:  # /api/lessons
                    # list all
                    lessons = db.get_all_lessons()
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps(lessons).encode())
                elif len(parts) == 3:  # /api/lessons/ID
                    try:
                        lesson_id = int(parts[2])
                        lesson = db.get_lesson(lesson_id)
                        if not lesson:
                            self.send_error(404)
                            return
                        self.send_response(200)
                        self.send_header('Content-type', 'application/json')
                        self.send_header('Access-Control-Allow-Origin', '*')
                        self.end_headers()
                        self.wfile.write(json.dumps(lesson).encode())
                    except ValueError:
                        self.send_error(400)
                else:
                    self.send_error(400)
            except Exception as e:
                print(f"Error getting lessons: {e}")
                self.send_error(500)

        else:
            self.send_error(404)
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def log_message(self, format, *args):
        # Suppress default logging
        pass

def main():
    PORT = 3000
    print("=" * 60)
    print(f"🚀 API Server ishga tushdi: http://localhost:{PORT}")
    print("=" * 60)
    
    with socketserver.TCPServer(("", PORT), OTPHandler) as httpd:
        httpd.serve_forever()

if __name__ == "__main__":
    main()
