// const Register = require('../../models/register');
// const multer = require('multer');
// const path = require('path');
// const PORT = 5000;
// const FILE_PATH = `http://localhost:${PORT}/banner/`;

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     let _dir = path.join(__dirname, '../../banners');
//     cb(null, _dir);
//   },
//   filename: function (req, file, cb) {
//     let filename = file.originalname.toLowerCase();
//     cb(null, filename);
//   },
// });

// const banner = multer({ storage: storage });

// const routes = function (app) {
//   app.get('/register', async (req, res) => {
//     try {
//       let query = {};

//       if (req.query.category) {
//         query.category = req.query.category;
//       }
//       let register = await Register.find(query).populate('residence_id', 'status_id');
//       res.json(register);
//     } catch (err) {
//       console.log(err.message);
//       res.send('Error fetching Url');
//     }
//   });

//   app.get('/register/total', async (req, res) => {
//     try {
//       let register = await Register.find().countDocuments();
//       res.json(register);
//     } catch (err) {
//       console.log(err);
//       res.send('Error fetching URL');
//     }
//   });

//   app.get('/register/:id', async (req, res) => {
//     try {
//       let register = await Register.findById(req.params.id).populate(
//         'residence_id',
//         'status_id'
//       );
//       res.json(register);
//     } catch (error) {
//       console.log(error);
//       res.send('error fetching residence');
//     }
//   });

//   app.post('/register', banner.any(), async (req, res) => {
//     try {

//       const existingRegisterCount = await Register.countDocuments();
//       let register = new Register(req.body);

//       register.identificationCode = existingRegisterCount + 1;
      
//       if (req.body.avatar) {
//         console.log(req.body.avatar);
//         register.avatar = 'a.png';
//       }
//       if (!req.files || req.files.length === 0) {
//         return res.status(400).json({ msg: 'No files uploaded', code: 400 });
//       }
      
//       req.files.forEach((e) => {
//         if (e.fieldname === 'avatar') {
//           register.avatar = FILE_PATH + e.filename;
//         }
//       });

      
//       if (!register.avatar) {
//         return res.status(400).json({ msg: 'Avatar not uploaded', code: 400 });
//       }
      
//       await register.save();
      
//       res.json({ msg: 'information created', code: 200 });
//     } catch (err) {
      
//       console.log(err.message);
//       res.send('Error fetching URL');
//     }
//   });

//   app.post('/register/:id', async (req, res) => {
//     try {
//       let register = await Register.findById(req.params.id);
//       res.json(register);
//     } catch (err) {
//       console.log(err);
//       res.send('server error occur');
//     }
//   });

//   app.put('/register/:id', async (req, res) => {
//     try {
//       const registerId = req.params.id;
//       const {
//         surname,
//         firstname,
//         othernames,
//         email,
//         phone,
//         created,
//         occupation,
//         street,
//         avatar,
//         house_number,
//         other_status,
//       } = req.body;

//       const existingRegister = await Register.findById(registerId);
//       if (!existingRegister) {
//         return res.status(404).json({ error: 'Register not found' });
//       }

//       existingRegister.surname = surname;
//       existingRegister.email = email;
//       existingRegister.occupation = occupation;
//       existingRegister.street = street;
//       existingRegister.firstname = firstname;
//       existingRegister.othernames = othernames;
//       existingRegister.phone = phone;
//       existingRegister.created = created;
//       existingRegister.avatar = avatar;
//       existingRegister.other_status = other_status;
//       existingRegister.house_number = house_number;

//       const updatedRegister = await existingRegister.save();

//       res.json(updatedRegister);
//     } catch (error) {
//       console.error('Error updating item:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });

//   app.delete('/register/:id', async (req, res) => {
//     try {
//       const registerId = req.params.id;

//       const existingRegister = await Register.findById(registerId);
//       if (!existingRegister) {
//         return res.status(404).json({ error: 'Register not found' });
//       }

//       await Register.findByIdAndRemove(registerId);

//       res.json({ message: 'Register deleted! ' });
//     } catch (error) {
//       console.error('Error deleting item:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });
// };

// module.exports = routes;
