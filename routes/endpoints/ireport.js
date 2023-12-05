const Ireport = require('../../models/ireport');
const Notification = require('../../models/notification');
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

const banner = multer({ storage: storage });

const routes = function (app) {
  app.get('/ireports', async (req, res) => {
    try {

      let query = {};

      if (req.query.category) {
        query.category = req.query.category;
      }
      let ireports = await Ireport.find(query).populate('user_id');
      res.json(ireports);
    } catch (err) {
      console.log(err);
      res.send('Error fetching URL');
    }
  });

  app.get('/ireports/total/:user_id', async (req, res) => {
    try {
      let ireports = await Ireport.find({ user_id: user_id }).countDocuments();
      res.json(ireports);
      
    } catch (err) {
      console.log(err);
      res.send('Error fetching URL');
    }
  });

  app.get('/ireports/notifications/:user_id', async (req, res) => {
    try {
      const userId = req.params.user_id;
      

      const ireports = await Ireport.find({
        userId
      }).sort({ createdAt: -1 });

      res.json(ireports);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'An error occurred while fetching unread notifications.',
      });
    }
  });

  
  app.get('/ireports/:id', async (req, res) => {
    try {
      const ireport = await Ireport.findById(req.params.id).populate('user_id', 'fullname');
      if (!ireport) {
        return res.status(404).json({ error: 'Ireport not found' });
      }
      res.json(ireport);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching ireport' });
    }
  });


  app.post('/ireport/:id', async (req, res) => {
    try {
      let ireport = await Ireport.findById(req.params.id);
      res.json(ireport);
    } catch (err) {
      console.log(err);
      res.send('server error occur');
    }
  });
  
  app.post('/ireports', banner.any(), async (req, res) => {
    try {
      const ireport = new Ireport(req.body);

      req.files.forEach((e) => {
        if (e.fieldname == 'avatar') {
          ireport.avatar = FILE_PATH + e.filename;
        }
      });

      await ireport.save();

    

      res.json({ msg: 'Information created', code: 200 });
    } catch (err) {
      console.log(err);
      res.send('Server error occurred');
    }
  });


  app.delete('/ireport/:id', async (req, res) => {
    try {
      const ireportId = req.params.id;

      const existingIreport = await Ireport.findById(ireportId);
      if (!existingIreport) {
        return res.status(404).json({ error: 'Ireport not found' });
      }

      await Ireport.findByIdAndRemove(ireportId);

      res.json({ message: 'Ireport deleted! ' });
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

module.exports = routes;
