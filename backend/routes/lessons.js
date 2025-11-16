const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Autentifikatsiya talab qilinadi' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token noto\'g\'ri' 
    });
  }
};

// Get user progress
router.get('/progress', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Foydalanuvchi topilmadi' 
      });
    }

    res.json({
      success: true,
      progress: user.progress
    });

  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi' 
    });
  }
});

// Mark lesson as completed
router.post('/complete/:lessonId', authMiddleware, async (req, res) => {
  try {
    const { lessonId } = req.params;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Foydalanuvchi topilmadi' 
      });
    }

    // Check if lesson already completed
    const existingProgress = user.progress.find(p => p.lessonId === parseInt(lessonId));

    if (existingProgress) {
      existingProgress.completed = true;
      existingProgress.completedAt = new Date();
    } else {
      user.progress.push({
        lessonId: parseInt(lessonId),
        completed: true,
        completedAt: new Date()
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Dars yakunlandi',
      progress: user.progress
    });

  } catch (error) {
    console.error('Complete lesson error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server xatosi' 
    });
  }
});

module.exports = router;
