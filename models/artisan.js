const mongoose = require('mongoose');

const ArtisanSchema = new mongoose.Schema({
  avatar: {
    type: String,
    required: true,
  },

  artisanFullname: {
    type: String,
    required: true,
  },

  artisanSpecialty: {
    type: String,
    required: true,
  },

  artisanContact: {
    type: String,
    required: true,
  },

  // estate_id: {
  //   type: String,
  //   ref: 'estates',
  // },

  user_id: {
    type: String,
    ref: 'users',
  },
});

const Artisan = mongoose.model('artisan', ArtisanSchema);

module.exports = Artisan;
