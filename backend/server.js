require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TelegramBotHandler = require('./bot');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB ulanish muvaffaqiyatli'))
  .catch(err => console.error('❌ MongoDB ulanish xatosi:', err));

// Initialize Telegram Bots
// Main bot for user authentication (existing system)
const authBot = new TelegramBotHandler(process.env.TELEGRAM_BOT_TOKEN);

// Set up webhook for auth bot
const WEBHOOK_URL = `${process.env.BACKEND_URL || 'https://sellers-pro-backend.onrender.com'}/api/telegram-webhook`;
authBot.bot.setWebHook(WEBHOOK_URL)
  .then(() => console.log('✅ Telegram webhook set:', WEBHOOK_URL))
  .catch(err => console.error('❌ Webhook setup error:', err));

// Lead notification bot (for website leads)
const TelegramBotAPI = require('node-telegram-bot-api');
const leadBot = process.env.LEAD_BOT_TOKEN 
  ? new TelegramBotAPI(process.env.LEAD_BOT_TOKEN) 
  : null;

// Make bots available to routes
app.set('telegramBot', authBot.bot); // For authentication
app.set('leadBot', leadBot); // For lead notifications

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/amocrm', require('./routes/amocrm'));

// Telegram webhook endpoint
app.post('/api/telegram-webhook', (req, res) => {
  authBot.bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Server xatosi' 
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server ${PORT} portda ishlamoqda`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
});

module.exports = app;
