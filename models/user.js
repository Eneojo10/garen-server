const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true},
  email: { type: String, unique: true },
  phone:{type: Number},
  password: {type:String, required:true},
  isAdmin: {
    type: Boolean,
    default: false,
  },
  resetToken: { type: String},
  resetTokenExpires: { type: Date}
},
{timestamps: true}
);

const User = mongoose.model('users', UserSchema);
module.exports = User;
