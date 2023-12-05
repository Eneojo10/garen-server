const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    payment_date: { type: String },
    service_type: { type: String },
    period_from: { type: String },
    to: { type: String },
    due_date: { type: String },
    amount: { type: Number },
    year: { type: Number },
    user_id: { type: String, ref: 'users' },
  },
  { timestamps: true }
);

const Payment = mongoose.model('payments', PaymentSchema);
module.exports = Payment;
