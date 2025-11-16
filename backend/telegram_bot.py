#!/usr/bin/env python3
"""
Working Telegram Bot for Sellers Pro
Sends real OTP codes via Telegram
"""

import asyncio
import random
import time
import json
from datetime import datetime, timedelta
from telegram import Update, ReplyKeyboardMarkup, KeyboardButton
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from database import Database

# Configuration
BOT_TOKEN = "7841643509:AAGe2c8dIj261293qbTwo8Kqkd9LlBvCSfE"

# Initialize database
db = Database()

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /start command"""
    chat_id = update.effective_chat.id
    user = update.effective_user
    
    welcome_message = """
🎓 *Sellers Pro - Uzum Market Kursi*

Assalomu alaykum! Kursga xush kelibsiz.

Davom etish uchun telefon raqamingizni ulashing 👇
    """
    
    # Contact button
    contact_keyboard = ReplyKeyboardMarkup(
        [[KeyboardButton("📱 Telefon raqamni ulashish", request_contact=True)]],
        resize_keyboard=True,
        one_time_keyboard=True
    )
    
    await update.message.reply_text(
        welcome_message,
        parse_mode='Markdown',
        reply_markup=contact_keyboard
    )

async def handle_contact(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle contact sharing"""
    contact = update.message.contact
    user = update.effective_user
    chat_id = update.effective_chat.id
    
    if contact.user_id != user.id:
        await update.message.reply_text(
            "❌ Iltimos, o'z telefon raqamingizni ulashing."
        )
        return
    
    # Save user to database
    user_id = db.add_user(
        telegram_id=str(user.id),
        first_name=user.first_name,
        last_name=user.last_name,
        username=user.username,
        phone_number=contact.phone_number
    )
    
    # Generate OTP
    otp_code = str(random.randint(100000, 999999))
    expires_at = (datetime.now() + timedelta(minutes=1)).isoformat()
    
    # Save to database
    db.add_otp(str(user.id), otp_code, expires_at)
    
    otp_message = f"""
✅ *Tasdiqlash kodi*

Sizning OTP kodingiz: `{otp_code}`

⚠️ Bu kod *1 daqiqa* amal qiladi.
🔒 Kodni hech kimga bermang!

Kodni veb-saytda kiriting.
    """
    
    await update.message.reply_text(
        otp_message,
        parse_mode='Markdown'
    )
    
    print(f"✅ OTP sent to {user.first_name}: {otp_code}")

async def request_otp(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /otp command"""
    user = update.effective_user
    
    # Check if user exists in database
    conn = db.get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT id FROM users WHERE telegram_id = ?', (str(user.id),))
    user_exists = cursor.fetchone()
    conn.close()
    
    if not user_exists:
        await update.message.reply_text(
            "❌ Avval /start buyrug'ini bosing va telefon raqamingizni ulashing."
        )
        return
    
    # Generate new OTP
    otp_code = str(random.randint(100000, 999999))
    expires_at = (datetime.now() + timedelta(minutes=1)).isoformat()
    
    # Save to database
    db.add_otp(str(user.id), otp_code, expires_at)
    
    otp_message = f"""
✅ *Yangi tasdiqlash kodi*

Sizning OTP kodingiz: `{otp_code}`

⚠️ Bu kod *1 daqiqa* amal qiladi.
    """
    
    await update.message.reply_text(
        otp_message,
        parse_mode='Markdown'
    )
    
    print(f"✅ New OTP sent to {user.first_name}: {otp_code}")

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /help command"""
    help_text = """
📚 *Yordam*

Mavjud buyruqlar:
/start - Botni ishga tushirish
/otp - Yangi OTP kod olish
/help - Yordam

Savol bo'lsa, @support ga murojaat qiling.
    """
    
    await update.message.reply_text(help_text, parse_mode='Markdown')

def main():
    """Start the bot"""
    print("=" * 60)
    print("🤖 TELEGRAM BOT ISHGA TUSHMOQDA...")
    print("=" * 60)
    print(f"Bot: @sellerprouz_bot")
    print(f"Link: https://t.me/sellerprouz_bot")
    print("=" * 60)
    
    # Create application
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Add handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("otp", request_otp))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(MessageHandler(filters.CONTACT, handle_contact))
    
    # Start bot
    print("✅ Bot tayyor! /start buyrug'ini bosing va telefon ulashing.")
    print("💾 Ma'lumotlar SQLite bazasida saqlanadi: /tmp/sellers_pro.db")
    print("=" * 60)
    
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
