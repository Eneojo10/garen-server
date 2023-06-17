const mongoose = require('mongoose');


const contentMgtSchema = new mongoose.Schema({
  avatar: {type: String}
},
  {timestamps:true}
)

const contentMgt = mongoose.model('contents', contentMgtSchema);
module.exports = contentMgt;