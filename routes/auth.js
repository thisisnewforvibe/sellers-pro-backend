const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');

// Verify OTP and login
router.post('/verify-otp', async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp || otp.length !== 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP 6 raqamdan iborat bo\'lishi kerak' 
      });
    }

    // Find valid OTP
    const otpRecord = await OTP.findOne({
      code: otp,
      used: false,
      expiresAt: { $gt: new Date() }
    });

    if (!otpRecord) {
      return res.status(401).json({ 
        success: false, 
        message: 'Noto\'g\'ri yoki muddati o\'tgan kod' 
      });
    }

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    // Find user by Telegram ID or phone number
    let user = await User.findOne({ 
      $or: [
        { telegramId: otpRecord.telegramId },
        { phoneNumber: otpRecord.phoneNumber }
      ]
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Foydalanuvchi topilmadi. Admin bilan bog\'laning.' 
      });
    }

    // Update telegram ID if it was manually created
    if (user.telegramId && user.telegramId.startsWith('manual_')) {
      user.telegramId = otpRecord.telegramId;
      await user.save();
    }

    // Generate JWT token (allow login even without active subscription)
    const token = jwt.sign(
      { 
        userId: user._id, 
        telegramId: user.telegramId 
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Return success with subscription status
    res.json({
      success: true,
      message: 'Muvaffaqiyatli!',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        subscription: user.subscription,
        progress: user.progress
      },
      hasAccess: user.subscription.active && (!user.subscription.endDate || new Date(user.subscription.endDate) > new Date())
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi' 
    });
  }
});

// Verify token
router.post('/verify-token', async (req, res) => {
  try {
    // Accept token from either Authorization header or request body
    const token = req.headers.authorization?.split(' ')[1] || req.body.token;

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token topilmadi' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Foydalanuvchi topilmadi' 
      });
    }

    // Check subscription status but don't block access
    const hasAccess = user.subscription.active && (!user.subscription.endDate || new Date(user.subscription.endDate) > new Date());
    
    // Mark expired subscriptions as inactive
    if (user.subscription.endDate && new Date(user.subscription.endDate) < new Date() && user.subscription.active) {
      user.subscription.active = false;
      await user.save();
    }

    res.json({
      success: true,
      hasAccess,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        subscription: user.subscription,
        progress: user.progress
      }
    });

  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token noto\'g\'ri' 
    });
  }
});

module.exports = router;
