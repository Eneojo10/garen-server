const mongoose = require('mongoose')

const IreportSchema = new mongoose.Schema(
  {
    report: { type: String, required: true },
    avatar: { type: String},
    contact: {type: String},
    risk: {type: String},
    user: { type: mongoose.Types.ObjectId, ref: 'users' },
  },
  { timestamps: true }
);

const Ireport = mongoose.model('ireports', IreportSchema)

module.exports = Ireport;