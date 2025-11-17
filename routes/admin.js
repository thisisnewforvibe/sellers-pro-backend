const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/users', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-__v');

    // Transform to frontend format
    const transformedUsers = users.map(user => ({
      id: user._id,
      telegram_id: user.telegramId,
      first_name: user.firstName,
      last_name: user.lastName,
      username: user.username,
      phone_number: user.phoneNumber,
      subscription_type: user.subscription?.type || 'basic',
      subscription_active: user.subscription?.active || false,
      subscription_start: user.subscription?.startDate,
      subscription_end: user.subscription?.endDate,
      created_at: user.createdAt,
      progress: user.progress
    }));

    res.json(transformedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi' 
    });
  }
});

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSubscriptions = await User.countDocuments({ 'subscription.active': true });
    
    // Count total completed lessons
    const users = await User.find();
    let completedLessons = 0;
    users.forEach(user => {
      if (user.progress) {
        completedLessons += user.progress.filter(p => p.completed).length;
      }
    });

    // Count logins today (approximate by users created today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const loginsToday = await User.countDocuments({ 
      createdAt: { $gte: today } 
    });

    res.json({
      total_users: totalUsers,
      active_subscriptions: activeSubscriptions,
      completed_lessons: completedLessons,
      logins_today: loginsToday
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi' 
    });
  }
});

// Update user subscription
router.post('/subscription', async (req, res) => {
  try {
    const { userId, active, type, duration } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID kerak' 
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Foydalanuvchi topilmadi' 
      });
    }

    // Update subscription
    user.subscription.active = active !== undefined ? active : user.subscription.active;
    user.subscription.type = type || user.subscription.type || 'premium';
    
    // Set subscription dates
    if (active) {
      if (!user.subscription.startDate) {
        user.subscription.startDate = new Date();
      }
      
      // Calculate end date based on duration (in days)
      if (duration) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + parseInt(duration));
        user.subscription.endDate = endDate;
      }
    }

    await user.save();

    res.json({
      success: true,
      message: 'Obuna yangilandi',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        subscription: user.subscription
      }
    });

  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi' 
    });
  }
});

// Add new user manually (whitelist)
router.post('/add-user', async (req, res) => {
  try {
    const { phoneNumber, firstName, lastName, telegramId, duration } = req.body;

    if (!phoneNumber || !firstName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Telefon raqam va ism kerak' 
      });
    }

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { phoneNumber },
        { telegramId: telegramId || null }
      ]
    });

    if (user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bu foydalanuvchi allaqachon mavjud' 
      });
    }

    // Calculate end date
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (parseInt(duration) || 30));

    // Create new user
    user = new User({
      telegramId: telegramId || `manual_${Date.now()}`,
      firstName,
      lastName: lastName || '',
      phoneNumber,
      username: '',
      subscription: {
        type: 'premium',
        active: true,
        startDate,
        endDate
      },
      progress: []
    });

    await user.save();

    res.json({
      success: true,
      message: 'Foydalanuvchi qo\'shildi',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        subscription: user.subscription
      }
    });

  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi' 
    });
  }
});

// Delete user
router.delete('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Foydalanuvchi topilmadi' 
      });
    }

    res.json({
      success: true,
      message: 'Foydalanuvchi o\'chirildi'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi' 
    });
  }
});

module.exports = router;
