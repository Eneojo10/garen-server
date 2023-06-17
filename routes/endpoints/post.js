const Post = require('../../models/post');

const multer = require('multer');
const fs = require('fs');
const path = require('path');
const PORT = 5001;
const FILE_PATH = `http://localhost:${PORT}/banner/`;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let _dir = path.join(__dirname, '../../banners');
    cb(null, _dir);
  },
  filename: function (req, file, cb) {
    let filename = file.originalname.toLowerCase();
    cb(null, filename);
  },
});

const banner = multer({ storage });

const routes = function (app) {
  app.get('/banner/:name', async (req, res) => {
    try{
      let file;
      let filename = path.join(__dirname, '../../banners', req.params.name);
      if (!fs.existsSync(filename))
        return res.json({
          msg: 'File does not exist'
        });
      file = fs.createReadStream(filename);
      file.pipe(res);
    }catch (err) {
      res.send('server error occurs');
    }
  });

  app.post('/posts/form', banner.any(), async (req, res) => {
    try{
      let post = new Post(re.body);

      req.files.forEach((e) => {
        if (e.filename == 'banner') {
          post.banner = FILE_PATH + e.filename;
          console.log(FILE_PATH + e.filename);
        }
      });

      await post.save();
      res.json({msg: 'post created', code:200})
    }catch (err) {
      console.log(err);
      res.send('server error occurs');
    }
  });

  app.post('/posts', async (req,res) => {
    try{
      let post = new Post(req.body);

      await post.save();
      res.json({msg: 'Post created', code:200});
    }catch(err) {
      console.log(err);
      res.send('server error occurs');
    }
  });

  app.put('/posts/:id', async (req, res) => {
    try{
      let post = await Post.findOne({ _id: req.params.id});

      if (!post) return res.json({msg: 'post does not exist'})
      if(req.body){
        
        post.overwrite({...post._doc, ...req.body})
      }

      await post.save();
      res.json({msg: 'post updated', code:200});
    }catch (err) {
      console.log(err);
      res.send('server error occurs');
    }
  });

  app.delete('/posts/:id', async (req, res) => {
    try{
      await Post.deleteOne({_id: req.params.id});
      res.json({msg: 'Post deleted!!!', code:200});
    }catch(err) {
      res.status(500).send(err)
    }
  })
};

module.exports = routes