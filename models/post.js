const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
  {
    banner: { type: String },
    residence_id: { type: mongoose.Types.ObjectId, ref: 'residence' },
    
  },
  { timestamps: true }
);

const Post = mongoose.model('posts', PostSchema);
module.exports = Post;