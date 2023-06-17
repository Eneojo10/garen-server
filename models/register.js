const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema(
  {
    surname: { type: String, required: true },
    firstname: { type: String, required: true },
    othernames: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: Number },
    residence_id: {type:mongoose.Types.ObjectId, ref: 'residences'},
    home_status: {type: String},
    street: {type: String},
    house_number: {type: String},
    avatar: { type: String, default: '' },
    occupation:{type: String}
  },
  { timestamps: true }
);

const register = mongoose.model('register', RegisterSchema);
module.exports = register;