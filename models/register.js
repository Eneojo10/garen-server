// const mongoose = require('mongoose');

// const RegisterSchema = new mongoose.Schema(
//   {
//     firstname: { type: String, required: true },
//     lastname: { type: String },
//     residence_id: { type: String, ref: 'residence' },
//     status_id: { type: String, ref: 'status' },
//     street: { type: String },
//     house_number: { type: String, required: true },
//     avatar: { type: String },
//     occupation: { type: String },
//     created: { type: String },
//     address: { type: String },
//     other_status: { type: String },
//     home_status: { type: String },
//     user_id: { type: String, ref: 'users' },
//     identificationCode: {
//       type: Number,
//       required: true,
//     },
    
//   },
//   { timestamps: true }
// );

// const register = mongoose.model('register', RegisterSchema);
// module.exports = register;