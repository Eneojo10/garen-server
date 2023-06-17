const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  isRead: {
    type: Boolean,
    default: false,
  },
});

const Notification = mongoose.model('notifications', NotificationSchema);
module.exports = Notification;
