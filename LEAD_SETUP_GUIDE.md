# 🎯 How to Receive Leads from Your Website

## ✅ What I Set Up:

Your website now sends leads directly to **Telegram**! Every time someone fills out the form, you'll get an instant notification.

---

## 📋 Setup Steps:

### 1. **Create .env File** (Backend Configuration)

Create a file called `.env` in the `/backend` folder with these settings:

```env
# MongoDB Database
MONGODB_URI=your_mongodb_connection_string

# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
ADMIN_TELEGRAM_ID=your_telegram_chat_id

# Server Config
PORT=3000
FRONTEND_URL=http://localhost:8000

# JWT Secret
JWT_SECRET=your_random_secret_key_here
```

### 2. **Get Your Telegram Bot Token**

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Copy the **token** BotFather gives you
5. Paste it in `.env` as `TELEGRAM_BOT_TOKEN`

### 3. **Get Your Telegram Chat ID**

1. Search for **@userinfobot** on Telegram
2. Send it any message
3. It will reply with your **Chat ID**
4. Copy the number and paste it in `.env` as `ADMIN_TELEGRAM_ID`

### 4. **Install Node.js**

Download and install from: https://nodejs.org/

### 5. **Start the Backend Server**

```bash
cd /Users/mackbook/Desktop/sellers-pro-backup/backend
npm install
npm start
```

### 6. **Update Frontend Configuration**

Edit `config.js` to use localhost:

```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:3000',  // Changed from Render URL
    ENDPOINTS: {
        VERIFY_OTP: '/api/auth/verify-otp',
        GET_LESSONS: '/api/lessons',
        HEALTH: '/api/health'
    }
};
```

---

## 🎉 How It Works:

1. User visits your website
2. User fills out the form (name + phone)
3. **Instantly**, you receive a Telegram message like:

```
🔔 Yangi Lead!

👤 Ism: John Doe
📱 Telefon: +998 90 123 45 67
🕐 Vaqt: 2/11/2025, 14:30:25

💼 Web-saytdan kelgan lead
```

---

## 🔄 Alternative: Use Google Sheets (No Backend Needed)

If you don't want to set up a backend, you can send leads to Google Sheets:

1. Create a Google Form
2. Embed it on your website
3. Leads automatically save to Google Sheets

Let me know if you want this simpler option!

---

## 📞 Current Status:

✅ Frontend: Running on http://localhost:8000
❌ Backend: Not running (need Node.js)
✅ Lead form: Active and ready
✅ Telegram integration: Code ready

**Once you complete the setup, leads will flow directly to your Telegram! 🚀**
