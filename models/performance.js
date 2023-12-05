const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  user_id: {
    type: String,
    ref: 'users',
    required: true,
  },

  month: {
    type: String,
    required: true,
  },

  score: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Performance', performanceSchema);
