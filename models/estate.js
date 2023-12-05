const mongoose = require('mongoose');

const estateSchema = new mongoose.Schema({
  estateName: { type: String, required: true },
});

module.exports = mongoose.model('estates', estateSchema);
