const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/User');
const OTP = require('./models/OTP');

class TelegramBotHandler {
  constructor(token) {
    // Use webhook instead of polling to avoid conflicts
    this.bot = new TelegramBot(token, { 
      polling: false
    });
    
    this.setupHandlers();
  }

  setupHandlers() {
    // /start command
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const telegramId = msg.from.id.toString();

      const welcomeMessage = `
🎓 *Sellers Pro - Uzum Market Kursi*

Assalomu alaykum! Kursga xush kelibsiz.

Davom etish uchun telefon raqamingizni ulashing 👇
      `;

      const keyboard = {
        keyboard: [[{
          text: '📱 Telefon raqamni ulashish',
          request_contact: true
        }]],
        resize_keyboard: true,
        one_time_keyboard: true
      };

      await this.bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
      });
    });

    // Handle contact sharing
    this.bot.on('contact', async (msg) => {
      const chatId = msg.chat.id;
      const contact = msg.contact;
      const telegramId = msg.from.id.toString();

      if (contact.user_id.toString() !== telegramId) {
        return this.bot.sendMessage(chatId, '❌ Iltimos, o\'z telefon raqamingizni ulashing.');
      }

      try {
        // Normalize phone number (ensure it starts with +)
        let phoneNumber = contact.phone_number;
        if (!phoneNumber.startsWith('+')) {
          phoneNumber = '+' + phoneNumber;
        }

        // Check if user exists by phone number (priority) or Telegram ID
        let user = await User.findOne({ 
          $or: [
            { phoneNumber },
            { telegramId }
          ]
        });

        if (!user) {
          // Create new user (with inactive subscription by default)
          user = new User({
            telegramId,
            firstName: msg.from.first_name,
            lastName: msg.from.last_name,
            username: msg.from.username,
            phoneNumber
          });
          await user.save();
        } else if (user.telegramId && user.telegramId.startsWith('manual_')) {
          // Update manually created user with real Telegram ID
          user.telegramId = telegramId;
          user.firstName = msg.from.first_name || user.firstName;
          user.lastName = msg.from.last_name || user.lastName;
          user.username = msg.from.username || user.username;
          await user.save();
        }

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 60000); // 1 minute

        // Save OTP with phone number
        const otp = new OTP({
          telegramId,
          phoneNumber,
          code: otpCode,
          expiresAt
        });
        await otp.save();

        const otpMessage = `
✅ *Tasdiqlash kodi*

Sizning OTP kodingiz: \`${otpCode}\`

⚠️ Bu kod *1 daqiqa* amal qiladi.
🔒 Kodni hech kimga bermang!

Kodni veb-saytda kiriting.
        `;

        await this.bot.sendMessage(chatId, otpMessage, {
          parse_mode: 'Markdown',
          reply_markup: { remove_keyboard: true }
        });

      } catch (error) {
        console.error('Error handling contact:', error);
        await this.bot.sendMessage(chatId, '❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
      }
    });

    // /otp command - request new OTP
    this.bot.onText(/\/otp/, async (msg) => {
      const chatId = msg.chat.id;
      const telegramId = msg.from.id.toString();

      try {
        const user = await User.findOne({ telegramId });

        if (!user) {
          return this.bot.sendMessage(chatId, '❌ Avval /start buyrug\'ini bosing va telefon raqamingizni ulashing.');
        }

        // Generate new OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 60000);

        const otp = new OTP({
          telegramId,
          code: otpCode,
          expiresAt
        });
        await otp.save();

        const otpMessage = `
✅ *Yangi tasdiqlash kodi*

Sizning OTP kodingiz: \`${otpCode}\`

⚠️ Bu kod *1 daqiqa* amal qiladi.
        `;

        await this.bot.sendMessage(chatId, otpMessage, { parse_mode: 'Markdown' });

      } catch (error) {
        console.error('Error generating OTP:', error);
        await this.bot.sendMessage(chatId, '❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
      }
    });

    // /help command
    this.bot.onText(/\/help/, async (msg) => {
      const chatId = msg.chat.id;

      const helpMessage = `
📚 *Yordam*

Mavjud buyruqlar:
/start - Botni ishga tushirish
/otp - Yangi OTP kod olish
/help - Yordam

Savol bo'lsa, @support ga murojaat qiling.
      `;

      await this.bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
    });

    console.log('✅ Telegram bot ishga tushdi!');
  }
}

module.exports = TelegramBotHandler;
