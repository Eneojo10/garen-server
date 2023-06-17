const mongoose = require('mongoose');


const ConfigurationSchema = new mongoose.Schema(
  {
    name: { type: String },
    logo: { type: String },
    total_houses: { type: Number },
    
  },
  {
    timestamps: true,
  }
);

const Configuration = mongoose.model('config', ConfigurationSchema);
module.exports = Configuration;