const TelegramBot = require('node-telegram-bot-api');

// Your bot token
const token = '8258730522:AAF6leBBQGbWmo_ut8OgZI6peG9EITweMxk';

// Create bot instance
const bot = new TelegramBot(token, { polling: true });

console.log('🤖 Bot is running!');
console.log('📱 Open Telegram and send a message to @prosellers_leadlar_bot');
console.log('⏳ Waiting for your message...\n');

// Listen for any message
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from.first_name || 'User';
  
  console.log('✅ Message received!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`👤 From: ${name}`);
  console.log(`🆔 Your Chat ID: ${chatId}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`📝 Copy this Chat ID and add it to your .env file:`);
  console.log(`   ADMIN_TELEGRAM_ID=${chatId}\n`);
  
  // Send confirmation
  bot.sendMessage(chatId, `✅ Perfect!\n\nYour Chat ID is: ${chatId}\n\nAdd this to your .env file and restart the server.`);
  
  // Stop after getting chat ID
  setTimeout(() => {
    console.log('✅ Done! You can stop this script now (Ctrl+C)');
  }, 2000);
});

console.log('💡 TIP: If nothing happens, make sure you:');
console.log('   1. Started the bot on Telegram');
console.log('   2. Sent /start command first\n');
