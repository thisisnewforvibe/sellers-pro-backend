# Sellers Pro Backend

Backend server for the Sellers Pro course platform with MongoDB, Express, and Telegram Bot integration.

## Features

- 🔐 OTP-based authentication via Telegram
- 💾 MongoDB database for user data
- 📱 Telegram bot integration
- 🎓 Lesson progress tracking
- 🔒 JWT token authentication

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup MongoDB

Install MongoDB locally or use MongoDB Atlas:
- Local: https://www.mongodb.com/try/download/community
- Atlas: https://www.mongodb.com/cloud/atlas

### 3. Create Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow instructions to create your bot
4. Save the bot token
5. Get your bot username

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` file:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sellers-pro
JWT_SECRET=your_random_secret_key_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_BOT_USERNAME=YourBotUsername
FRONTEND_URL=http://localhost:8080
OTP_EXPIRY_MINUTES=1
```

### 5. Start Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication

**POST** `/api/auth/verify-otp`
- Body: `{ "otp": "123456" }`
- Returns: JWT token and user data

**GET** `/api/auth/verify-token`
- Headers: `Authorization: Bearer <token>`
- Returns: User data

### Lessons

**GET** `/api/lessons/progress`
- Headers: `Authorization: Bearer <token>`
- Returns: User's lesson progress

**POST** `/api/lessons/complete/:lessonId`
- Headers: `Authorization: Bearer <token>`
- Marks lesson as completed

## Telegram Bot Commands

- `/start` - Start bot and register
- `/otp` - Request new OTP code
- `/help` - Show help message

## User Flow

1. User visits registration page
2. Clicks "Open Telegram Bot" button
3. Presses `/start` in Telegram
4. Shares phone contact
5. Bot sends 6-digit OTP (valid for 1 minute)
6. User enters OTP on website
7. Server verifies OTP and returns JWT token
8. User is redirected to dashboard

## Database Models

### User
```javascript
{
  telegramId: String,
  firstName: String,
  lastName: String,
  username: String,
  phoneNumber: String,
  subscription: {
    type: String, // 'basic' or 'premium'
    startDate: Date,
    endDate: Date,
    active: Boolean
  },
  progress: [{
    lessonId: Number,
    completed: Boolean,
    completedAt: Date
  }],
  createdAt: Date
}
```

### OTP
```javascript
{
  telegramId: String,
  code: String,
  expiresAt: Date,
  used: Boolean,
  createdAt: Date
}
```

## Security Notes

- OTP codes expire after 1 minute
- JWT tokens expire after 30 days
- Used OTP codes are marked and cannot be reused
- Expired OTPs are auto-deleted from database
- All endpoints except auth require JWT token

## Deployment

### Using PM2 (Recommended)

```bash
npm install -g pm2
pm2 start server.js --name sellers-pro
pm2 save
pm2 startup
```

### Using Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

## Testing

Test the API:
```bash
# Health check
curl http://localhost:3000/api/health

# Verify OTP (replace with actual OTP)
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"otp":"123456"}'
```

## Support

For issues or questions, contact support or check the documentation.
