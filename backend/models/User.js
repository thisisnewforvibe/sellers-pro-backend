const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String
  },
  username: {
    type: String
  },
  phoneNumber: {
    type: String,
    required: true
  },
  subscription: {
    type: {
      type: String,
      enum: ['basic', 'premium'],
      default: 'basic'
    },
    startDate: Date,
    endDate: Date,
    active: {
      type: Boolean,
      default: false
    }
  },
  progress: [{
    lessonId: Number,
    completed: Boolean,
    completedAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
