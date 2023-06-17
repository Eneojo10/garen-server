const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    fullname: { type: String },
    payment_date: {type: String},
    service_type: {type: String},
    period_from: {type: String},
    to: {type:String},
    due_date: {type: String},
  },
  { timestamps: true }
);

const Payment = mongoose.model('payments', PaymentSchema);
module.exports = Payment;
