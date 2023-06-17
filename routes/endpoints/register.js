const Register = require('../../models/register');
const multer = require('multer');
const path = require('path');
const PORT = 5000;
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
  app.get('/register', async (req, res) => {
    try {
      let register = await Register.find();
      res.json(register);
    } catch (err) {
      res.send('Error fetching URL');
    }
  });

  app.post('/register', banner.any(), async (req, res) => {
    try {
      let register = new Register(req.body);
      
      req.files.forEach((e) => {
        if (e.fieldname == 'avatar') {
          register.avatar = FILE_PATH + e.filename;
        }
      });

      await register.save();
      res.json({ msg: 'residence created', code: 200 });
    } catch (err) {
      console.log(err);
      res.send('server error occurs');
    }
  });
};

module.exports = routes;
