const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: false
  },
  code: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  used: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-delete expired OTPs after 2 minutes
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 120 });

module.exports = mongoose.model('OTP', otpSchema);
