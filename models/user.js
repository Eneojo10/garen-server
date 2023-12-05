const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    fullname: { type: String },
    email: { type: String, unique: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    firstname: { type: String },
    lastname: { type: String },
    residence_id: { type: String, ref: 'residence' },
    status_id: { type: String, ref: 'status' },
    street: { type: String },
    house_number: { type: String },
    avatar: { type: String },
    occupation: { type: String },
    created: { type: String },
    address: { type: String },
    other_status: { type: String },
    home_status: { type: String },
    user_id: { type: String, ref: 'users' },
    identificationCode: {
      type: Number,
    },

    role: {
      type: String,
      enum: ['SUPER ADMIN', 'ADMIN', 'USER'],
      default: 'user',
      uppercase: true,
    },
    estate_id: {
      type: String,
      ref: 'estates',
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  { timestamps: true }
);

const User = mongoose.model('users', UserSchema);
module.exports = User;
