const mongoose = require('mongoose');


const ResidenceSchema = new mongoose.Schema({
    category: {type:String}
},
  {timestamps: true}
)

const Residence = mongoose.model('residences', ResidenceSchema)

module.exports = Residence;