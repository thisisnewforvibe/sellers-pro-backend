const express = require('express');
const router = express.Router();

// POST /api/leads - Submit a new lead
router.post('/', async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Validation
    if (!name || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ism va telefon raqam majburiy' 
      });
    }

    if (name.length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ism kamida 2 ta harfdan iborat bo\'lishi kerak' 
      });
    }

    // Get Telegram bot instance from app
    const leadBot = req.app.get('leadBot'); // Use separate lead bot
    const adminChatId = process.env.ADMIN_TELEGRAM_ID;

    if (leadBot && adminChatId) {
      // Send notification to admin via Telegram
      const message = `
🔔 *Yangi Lead!*

👤 *Ism:* ${name}
📱 *Telefon:* ${phone}
🕐 *Vaqt:* ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}

💼 _Web-saytdan kelgan lead_
      `;

      await leadBot.sendMessage(adminChatId, message, {
        parse_mode: 'Markdown'
      });
    }

    // Send success response
    res.json({ 
      success: true, 
      message: 'Ma\'lumotlaringiz qabul qilindi. Tez orada siz bilan bog\'lanamiz!' 
    });

  } catch (error) {
    console.error('Lead submission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi. Iltimos, qaytadan urinib ko\'ring.' 
    });
  }
});

module.exports = router;
