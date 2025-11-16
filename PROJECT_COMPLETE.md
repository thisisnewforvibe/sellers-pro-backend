# Sellers Pro - Complete Course Platform

## 📦 Project Summary

A complete online course platform for teaching Uzum Market selling skills with:
- Landing page with pricing
- OTP-based authentication via Telegram bot
- Course dashboard with lesson tracking
- Full backend with MongoDB and Express
- Telegram bot integration

## 📁 Project Structure

```
sellers-pro/
├── Frontend (Website)
│   ├── index.html              # Landing page
│   ├── register.html           # Registration/Login page
│   ├── dashboard.html          # Course dashboard
│   ├── lesson.html             # Lesson viewer
│   ├── styles.css              # Landing page styles
│   ├── register-styles.css     # Registration page styles
│   ├── dashboard-styles.css    # Dashboard styles
│   ├── lesson-styles.css       # Lesson page styles
│   ├── script.js               # Landing page scripts
│   ├── register-script.js      # Registration logic
│   ├── dashboard-script.js     # Dashboard logic
│   ├── lesson-data.js          # Mock lesson data
│   └── auth-check.js           # Authentication checker
│
├── Backend (API & Bot)
│   ├── server.js               # Express server
│   ├── bot.js                  # Telegram bot handler
│   ├── package.json            # Dependencies
│   ├── .env.example            # Environment template
│   ├── models/
│   │   ├── User.js             # User database model
│   │   └── OTP.js              # OTP database model
│   └── routes/
│       ├── auth.js             # Authentication routes
│       └── lessons.js          # Lesson progress routes
│
└── Documentation
    ├── README.md               # Backend documentation
    ├── SETUP.md                # Complete setup guide
    └── START_BOT_INSTRUCTIONS.md  # Bot setup instructions
```

## 🎨 Design Features

### Colors
- Background: `#161616`
- Primary Purple: `#4E11C8`
- Button Blue: `#6366f1`
- Dark Gray: `#2a2a2a`
- Muted Text: `#a3a3a3`
- Green Checkmark: `#22c55e`

### Styling
- Border Radius: `6px` (consistent sharp edges)
- Font Family: Inter (Google Fonts)
- Responsive design with mobile breakpoints

## 🚀 Quick Start

### 1. Frontend Only (No Backend)
```bash
cd ~/Desktop/sellers-pro-backup
python3 -m http.server 8080
# Visit: http://localhost:8080
```

### 2. Full Setup (With Backend & Bot)

**Prerequisites:**
- Node.js 16+
- MongoDB 5+
- Telegram account

**Steps:**
```bash
# 1. Create Telegram Bot
# - Message @BotFather on Telegram
# - Send: /newbot
# - Follow instructions
# - Save the bot token

# 2. Setup Backend
cd ~/Desktop/sellers-pro-backup/backend
npm install
cp .env.example .env

# 3. Edit .env file
nano .env
# Add your bot token and settings

# 4. Start MongoDB
brew services start mongodb-community  # macOS
# or: sudo systemctl start mongod      # Linux

# 5. Start Backend
npm start

# 6. Start Frontend (new terminal)
cd ~/Desktop/sellers-pro-backup
python3 -m http.server 8080
```

## 📱 Telegram Bot Features

Once configured, your bot will:
- Accept `/start` command
- Request phone contact
- Generate 6-digit OTP codes
- OTP valid for 1 minute
- Support `/otp` for new codes
- Save user data to MongoDB

## 🔐 Authentication Flow

1. User clicks "Kursga yozilish" on landing page
2. Redirected to registration page
3. Opens Telegram bot, presses `/start`
4. Shares phone contact with bot
5. Bot sends 6-digit OTP (valid 1 minute)
6. User enters OTP on website
7. Backend verifies OTP, returns JWT token
8. User redirected to dashboard
9. Progress tracked in MongoDB

## 📊 Database Models

### User
```javascript
{
  telegramId: String,
  firstName: String,
  phoneNumber: String,
  subscription: {
    type: 'basic' | 'premium',
    active: Boolean
  },
  progress: [{ lessonId, completed, completedAt }]
}
```

### OTP
```javascript
{
  telegramId: String,
  code: String (6 digits),
  expiresAt: Date,
  used: Boolean
}
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/verify-otp` - Verify OTP code
- `GET /api/auth/verify-token` - Validate JWT token

### Lessons
- `GET /api/lessons/progress` - Get user progress
- `POST /api/lessons/complete/:id` - Mark lesson complete

## 📄 Pages Overview

### Landing Page (index.html)
- Hero section with CTA
- Course introduction video
- Pricing cards (500k and 1.2M som)
- Features list
- Footer

### Registration Page (register.html)
- Telegram bot instructions
- OTP input (6 digits)
- Auto-validation
- Error handling

### Dashboard (dashboard.html)
- Sidebar navigation
- Course modules
- Lesson list with progress
- Blue gradient header

### Lesson Page (lesson.html)
- Video player
- Lesson summary
- Resource links
- Download files section

## 🎓 Current Content

6 Lessons included:
1. Uzum Market bilan tanishuv
2. Hisob ochish va sozlash
3. Mahsulot qo'shish
4. Rasm va tavsif yozish
5. Narx strategiyasi
6. Birinchi sotuvlar

## 🔧 Technologies Used

### Frontend
- HTML5
- CSS3 (with custom properties)
- Vanilla JavaScript
- Google Fonts (Inter)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- node-telegram-bot-api

## 📦 Backup Locations

1. **Desktop Folder**: `~/Desktop/sellers-pro-backup/`
2. **Compressed Archive**: `~/Desktop/sellers-pro-complete.tar.gz`
3. **Original Location**: `/tmp/course-website/`

## 🔑 Environment Variables

Required in `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sellers-pro
JWT_SECRET=your_secret_key
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_BOT_USERNAME=your_bot_username
FRONTEND_URL=http://localhost:8080
OTP_EXPIRY_MINUTES=1
```

## 🚨 Important Notes

1. **Bot Token**: Keep it secret, never commit to Git
2. **MongoDB**: Required for OTP and user data
3. **JWT Secret**: Use strong random string in production
4. **CORS**: Configured for all origins in development
5. **OTP Expiry**: Automatically deleted after 2 minutes

## 🎯 Next Steps (Optional)

- [ ] Add payment integration (Click, Payme, Uzum)
- [ ] Create admin panel
- [ ] Add email notifications
- [ ] Video content protection
- [ ] Analytics dashboard
- [ ] Certificate generation
- [ ] More course modules

## 📞 Support

Files Location: `~/Desktop/sellers-pro-backup/`
Documentation: Check `SETUP.md` for detailed instructions

## 📝 License

All rights reserved - Sellers Pro Course Platform

---

**Created**: October 22, 2025
**Platform**: Course Management System
**Language**: Uzbek (uz)
**Status**: ✅ Complete and Ready to Deploy
