#!/usr/bin/env python3
"""
Simplified Telegram Bot Server (No Node.js required)
This runs the bot using Python instead
"""

import http.server
import socketserver
import json
import random
import time
from urllib.parse import parse_qs, urlparse
import threading

# In-memory storage (replace MongoDB)
otps = {}
users = {}

# Your bot token
BOT_TOKEN = "7841643509:AAGe2c8dIj261293qbTwo8Kqkd9LlBvCSfE"
BOT_USERNAME = "sellerprouz_bot"

class BotHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/auth/verify-otp':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            otp = data.get('otp')
            
            # Check if OTP exists and is valid
            current_time = time.time()
            valid_otp = None
            
            for telegram_id, otp_data in otps.items():
                if otp_data['code'] == otp and otp_data['expires_at'] > current_time:
                    valid_otp = otp_data
                    break
            
            if valid_otp:
                # Generate token
                token = f"token_{random.randint(100000, 999999)}"
                
                response = {
                    "success": True,
                    "message": "Muvaffaqiyatli!",
                    "token": token,
                    "user": {
                        "id": telegram_id,
                        "firstName": "User",
                        "subscription": {"type": "basic", "active": True},
                        "progress": []
                    }
                }
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
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
        else:
            self.send_error(404)
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def start_api_server():
    PORT = 3000
    with socketserver.TCPServer(("", PORT), BotHandler) as httpd:
        print(f"✅ API Server running on http://localhost:{PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    print("=" * 60)
    print("SIMPLIFIED TELEGRAM BOT SERVER")
    print("=" * 60)
    print(f"Bot Username: @{BOT_USERNAME}")
    print(f"Bot URL: https://t.me/{BOT_USERNAME}")
    print("")
    print("⚠️  MANUAL SETUP REQUIRED:")
    print("1. Open Telegram and go to @" + BOT_USERNAME)
    print("2. Press /start")
    print("3. When asked for OTP, use this TEST code: 123456")
    print("4. Paste it on the website")
    print("")
    print("💡 For REAL bot functionality, you need:")
    print("   - Install python-telegram-bot: pip3 install python-telegram-bot")
    print("   - Or use Node.js backend (install Node.js first)")
    print("=" * 60)
    
    # Add a test OTP for demo
    otps['test_user'] = {
        'code': '123456',
        'expires_at': time.time() + 3600  # Valid for 1 hour
    }
    
    start_api_server()
