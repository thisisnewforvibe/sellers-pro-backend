#!/usr/bin/env python3
"""
Add mock/test data to the database
"""

from database import Database
from datetime import datetime, timedelta
import random

db = Database()

# Mock users data
mock_users = [
    {
        'telegram_id': '123456789',
        'first_name': 'Alisher',
        'last_name': 'Karimov',
        'username': 'alisher_uz',
        'phone_number': '+998901234567'
    },
    {
        'telegram_id': '987654321',
        'first_name': 'Nodira',
        'last_name': 'Rahimova',
        'username': 'nodira_seller',
        'phone_number': '+998907654321'
    },
    {
        'telegram_id': '456789123',
        'first_name': 'Jamshid',
        'last_name': 'Toshmatov',
        'username': 'jamshid_pro',
        'phone_number': '+998909876543'
    },
    {
        'telegram_id': '789123456',
        'first_name': 'Dilnoza',
        'last_name': 'Ahmadova',
        'username': 'dilnoza_seller',
        'phone_number': '+998901112233'
    },
    {
        'telegram_id': '321654987',
        'first_name': 'Rustam',
        'last_name': 'Usmanov',
        'username': 'rustam_uz',
        'phone_number': '+998905556677'
    },
    {
        'telegram_id': '654987321',
        'first_name': 'Malika',
        'last_name': 'Yusupova',
        'username': 'malika_market',
        'phone_number': '+998903334455'
    },
    {
        'telegram_id': '147258369',
        'first_name': 'Bobur',
        'last_name': 'Nabiev',
        'username': 'bobur_seller',
        'phone_number': '+998906667788'
    },
    {
        'telegram_id': '369258147',
        'first_name': 'Sevara',
        'last_name': 'Alieva',
        'username': 'sevara_pro',
        'phone_number': '+998902223344'
    }
]

print("Adding mock users to database...")

for i, user_data in enumerate(mock_users):
    user_id = db.add_user(
        user_data['telegram_id'],
        user_data['first_name'],
        user_data['last_name'],
        user_data['username'],
        user_data['phone_number']
    )
    
    # Add some variety in subscriptions
    if i % 3 == 0:
        # Active premium subscription for 3 months
        db.update_subscription(user_id, 'premium', 90, True)
    elif i % 3 == 1:
        # Active basic subscription for 1 month
        db.update_subscription(user_id, 'basic', 30, True)
    else:
        # No active subscription
        db.update_subscription(user_id, 'basic', 0, False)
    
    # Add some completed lessons randomly
    for lesson_id in range(1, random.randint(1, 6)):
        db.update_lesson_progress(user_id, lesson_id, True)
    
    # Add login history
    db.log_login(user_id, '127.0.0.1')
    
    print(f"✅ Added: {user_data['first_name']} {user_data['last_name']}")

print("\n" + "="*60)
print(f"✅ Successfully added {len(mock_users)} mock users!")
print("="*60)
print("\n📊 Summary:")
stats = db.get_stats()
print(f"Total Users: {stats['total_users']}")
print(f"Active Subscriptions: {stats['active_subscriptions']}")
print(f"Completed Lessons: {stats['completed_lessons']}")
print(f"Logins Today: {stats['logins_today']}")
print("\n🌐 Refresh your admin panel to see the data!")
