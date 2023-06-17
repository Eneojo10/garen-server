const Ireport = require('../../models/ireport')
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

const routes = function(app){

  app.get('/ireports', async (req, res) => {
    try{
      let ireports = await Ireport.find();
      res.json(ireports);
    }catch (err) {
      console.log(err);
      res.send('Error fetching URL');
    }
  });
  
  app.post('/ireports', banner.any(), async (req, res) => {
    try {
      let ireport = new Ireport(req.body);

      req.files.forEach((e) => {
        if (e.fieldname == 'avatar') {
          ireport.avatar = FILE_PATH + e.filename;
        }
      });

      await ireport.save();
      res.json({ msg: 'information created', code: 200 });
    } catch (err) {
      console.log(err);
      res.send('Error fetching URL');
    }
  });
}

module.exports = routes;