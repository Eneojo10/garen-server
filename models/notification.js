const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'users',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  ireportCount: {
    type: Number,
    default: 0,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
