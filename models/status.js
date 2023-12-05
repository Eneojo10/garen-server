const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema(
  {
    resident: { type: String },
  },
  { timestamps: true }
);

const Status = mongoose.model('Status', StatusSchema);

module.exports = Status;
