const Artisan = require('../../models/artisan');
const multer = require('multer');
const path = require('path');
const Config = require('../../config.json');
const FILE_PATH =
  Config.MODE.toUpperCase() == 'PROD' ? Config.ONLINE_URL : Config.LOCAL_URL;
var cloudinary = require('cloudinary').v2;

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: 'auto',
  });
  return res;
}

cloudinary.config({
  cloud_name: 'dsr7fgsfi',
  api_key: '476945147655376',
  api_secret: 'SZtX0-BGtAEIGE5_FyAsXmTtT0Q',
  secure: true,
});

const avatar = multer({ storage: multer.memoryStorage() }).single('avatar');


const routes = function (app) {
  app.post('/artisan', avatar, async (req, res) => {
    try {
      
      if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
        const data = await handleUpload(dataURI);

      
        const newArtisan = new Artisan({
          avatar: data.url,
          artisanFullname: req.body.artisanFullname,
          artisanSpecialty: req.body.artisanSpecialty,
          artisanContact: req.body.artisanContact,
          artisanEmail: req.body.artisanEmail,
          aboutArtisan: req.body.aboutArtisan,
          artisanId: req.body.artisanId,
          user_id: req.body.user_id,
          // estate_id: req.body.estate_id,
        });

        const createdArtisan = await newArtisan.save();

        res.status(201).json(createdArtisan);
      } else {
        res.status(400).json({
          msg: 'Artisan cannot be saved without an image',
          code: 400,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/artisan', async (req, res) => {
    try {
      const loggedInAdminId = req.query.user_id;

      const artisans = await Artisan.find({
        user_id: loggedInAdminId,
      });

      res.json(artisans);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.put('/artisan/:id', avatar, async (req, res) => {
    try {
      const artisanId = req.params.id;
      const updatedData = {
        artisanFullname: req.body.artisanFullname,
        artisanSpecialty: req.body.artisanSpecialty,
        artisanContact: req.body.artisanContact,
        artisanEmail: req.body.artisanEmail,
        aboutArtisan: req.body.aboutArtisan,
        artisanId: req.body.artisanId,
        user_id: req.body.user_id,
      };

      if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
        const data = await handleUpload(dataURI);

        updatedData.avatar = data.url;
      }

      const updatedArtisan = await Artisan.findByIdAndUpdate(
        artisanId,
        updatedData,
        {
          new: true, // Return the updated document
        }
      );

      if (!updatedArtisan) {
        return res.status(404).json({ message: 'Artisan not found' });
      }

      res.json(updatedArtisan);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  app.delete('/artisan/:id', async (req, res) => {
    try {
      const artisanId = req.params.id;
      const deletedArtisan = await Artisan.findByIdAndDelete(artisanId);

      if (!deletedArtisan) {
        return res.status(404).json({ message: 'Artisan not found' });
      }

      res.json({ message: 'Artisan deleted', deletedArtisan });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  module.exports = routes;
};

module.exports = routes;
