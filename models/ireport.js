const mongoose = require('mongoose')

const ireportSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    avatar: { type: String },
    risk: { type: String },
    date: { type: String },
    user_id: { type: String, ref: 'users' },
    isRead: { type: Boolean, default: false },
    responded: { type: Boolean, default: false },
    dateAttendedTo: { type: String },
  },
  { timestamps: true }
);



const Ireport = mongoose.model('ireports', ireportSchema)

module.exports = Ireport;