# START YOUR TELEGRAM BOT

## You need to edit the .env file first!

1. Get your bot token from @BotFather on Telegram
2. Edit the .env file:
   
   nano /tmp/course-website/backend/.env
   
   Or use any text editor to change:
   - TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here  (replace with real token)
   - TELEGRAM_BOT_USERNAME=YourBotUsername  (replace with your bot username)
   - JWT_SECRET=generate_random_string_here  (use any random string)

3. Install MongoDB (if not installed):
   - macOS: brew install mongodb-community
   - Start: brew services start mongodb-community

4. Start the backend server:
   cd /tmp/course-website/backend
   npm start

5. Bot commands will be:
   /start - Register and get OTP
   /otp - Request new OTP code
   /help - Show help

## Quick Test (without MongoDB):

If you just want to test the website without database:
- The frontend will work
- Registration page will show
- Backend is optional for testing the UI

## Your bot username will be:
https://t.me/YOUR_BOT_USERNAME

Replace in register.html:
Line: <a href="https://t.me/YourBotUsername"
With: <a href="https://t.me/YOUR_ACTUAL_BOT_USERNAME"
