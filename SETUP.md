# Complete Setup Guide - Sellers Pro

## Prerequisites

1. **Node.js** (v16 or higher) - https://nodejs.org/
2. **MongoDB** (v5 or higher) - https://www.mongodb.com/try/download/community
3. **Telegram Account** - To create bot

## Step 1: Create Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Choose a name: `Sellers Pro`
4. Choose a username: `sellers_pro_bot` (must end with 'bot')
5. Save the token (looks like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)
6. Save the username: `sellers_pro_bot`

## Step 2: Setup Backend

```bash
# Navigate to backend folder
cd /tmp/course-website/backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file with your values
nano .env
```

**Edit .env:**
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sellers-pro
JWT_SECRET=YOUR_RANDOM_SECRET_KEY_HERE
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_FROM_BOTFATHER
TELEGRAM_BOT_USERNAME=sellers_pro_bot
FRONTEND_URL=http://localhost:8080
OTP_EXPIRY_MINUTES=1
```

## Step 3: Start MongoDB

```bash
# Start MongoDB service
# On macOS:
brew services start mongodb-community

# On Linux:
sudo systemctl start mongod

# On Windows:
# MongoDB should start automatically as a service
```

## Step 4: Start Backend Server

```bash
cd /tmp/course-website/backend
npm start
```

You should see:
```
✅ MongoDB ulanish muvaffaqiyatli
✅ Telegram bot ishga tushdi!
🚀 Server 3000 portda ishlamoqda
```

## Step 5: Start Frontend

```bash
# Open new terminal
cd /tmp/course-website

# Start a simple HTTP server
# Option 1: Using Python
python3 -m http.server 8080

# Option 2: Using Node.js (install first: npm install -g http-server)
http-server -p 8080
```

## Step 6: Update Telegram Bot Link

Edit `/tmp/course-website/register.html` and replace:
```html
<a href="https://t.me/YourBotUsername" target="_blank">
```

With:
```html
<a href="https://t.me/sellers_pro_bot" target="_blank">
```

## Step 7: Test the System

### 7.1 Test Registration Flow

1. Open browser: `http://localhost:8080/register.html`
2. Click "Telegram botni ochish"
3. In Telegram bot, press `/start`
4. Share your contact when prompted
5. Bot sends 6-digit OTP code
6. Copy and paste OTP on website
7. Click "Tasdiqlash"
8. Should redirect to dashboard

### 7.2 Test API Directly

```bash
# Health check
curl http://localhost:3000/api/health

# Should return: {"status":"OK","timestamp":"..."}
```

## API Integration

The frontend (`register-script.js`) is already configured to connect to:
```
http://localhost:3000/api/auth/verify-otp
```

## Production Deployment

### Deploy Backend to VPS

1. **Rent a VPS** (DigitalOcean, AWS, etc.)
2. **Install dependencies:**
```bash
sudo apt update
sudo apt install nodejs npm mongodb
```

3. **Clone/Upload your code**
4. **Setup environment:**
```bash
cd /path/to/backend
npm install --production
cp .env.example .env
nano .env  # Update with production values
```

5. **Use PM2 for process management:**
```bash
npm install -g pm2
pm2 start server.js --name sellers-pro-backend
pm2 startup
pm2 save
```

6. **Setup Nginx as reverse proxy:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Deploy Frontend

Upload frontend files to:
- **Netlify** (free): https://www.netlify.com/
- **Vercel** (free): https://vercel.com/
- **GitHub Pages** (free): https://pages.github.com/

Update API URL in `register-script.js`:
```javascript
const response = await fetch('https://api.yourdomain.com/api/auth/verify-otp', {
```

## Environment Variables (Production)

```env
PORT=3000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/sellers-pro
JWT_SECRET=YOUR_VERY_SECURE_RANDOM_SECRET_KEY
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN
TELEGRAM_BOT_USERNAME=sellers_pro_bot
FRONTEND_URL=https://yourdomain.com
OTP_EXPIRY_MINUTES=1
```

## Security Checklist

- ✅ Use strong JWT_SECRET (minimum 32 characters)
- ✅ Enable MongoDB authentication
- ✅ Use HTTPS in production
- ✅ Enable CORS only for your domain
- ✅ Keep bot token secret
- ✅ Set NODE_ENV=production
- ✅ Use environment variables
- ✅ Regular backups of MongoDB

## Troubleshooting

### Bot not responding
- Check TELEGRAM_BOT_TOKEN is correct
- Check bot is running: `pm2 logs sellers-pro`
- Message @BotFather and revoke/regenerate token

### OTP not working
- Check MongoDB is running: `sudo systemctl status mongod`
- Check backend logs: `pm2 logs` or `node server.js`
- Verify OTP hasn't expired (1 minute limit)

### Database errors
- Ensure MongoDB is running
- Check connection string in .env
- Run: `mongo` to test connection

### CORS errors
- Backend CORS is enabled for all origins in development
- In production, update cors configuration in server.js

## Support

Backend is running at: http://localhost:3000
Frontend is running at: http://localhost:8080

For questions, check:
- Backend logs: `pm2 logs sellers-pro` or check terminal
- MongoDB logs: `/var/log/mongodb/mongod.log`
- Telegram bot updates via @BotFather

## Next Steps

1. ✅ Set up payment integration (Click, Payme, Uzum)
2. ✅ Add subscription management
3. ✅ Create admin panel
4. ✅ Add email notifications
5. ✅ Implement lesson video protection
6. ✅ Add analytics dashboard
