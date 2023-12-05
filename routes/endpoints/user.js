const User = require('../../models/user');
const Estate = require('../../models/estate');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
  // Create Estate by super Admin
  app.post('/estates', async (req, res) => {
    try {
      const { user_id, estateName } = req.body;

      const user = await User.findById(user_id);
      console.log(user);
      if (!user || user.role !== 'SUPER ADMIN') {
        return res
          .status(403)
          .json({ message: 'Only Super-Admin can create estates...' });
      }
      let estate = new Estate({ estateName });
      await estate.save();

      res.status(201).json({ message: 'Estate created successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error.' });
    }
  });

  // Get All Estate
  app.get('/estates', async (req, res) => {
    try {
      let estateList = await Estate.find();
      res.status(200).json(estateList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  });

  // Create Admin
  app.post('/admin', async (req, res) => {
    try {
      const { user_id, phone, password, fullname, email, estate_id } = req.body;

      const user = await User.findById(user_id);

      if (!user || user.role !== 'SUPER ADMIN') {
        return res
          .status(403)
          .json({ message: 'Only Super Admin can create Admin...' });
      }

      if (!fullname || !email || !phone) {
        return res.status(400).json({ msg: 'one or more fields is not valid' });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ nsg: 'email format is not valid' });
      }

      const accct = await User.findOne({ email: email });
      if (accct) {
        return res.status(400).json({ msg: 'email already exist' });
      }

      const fullname_ = await User.findOne({ fullname: fullname });
      if (fullname_) {
        return res.status(400).json({ msg: 'Name already exist' });
      }

      const contact_ = await User.findOne({ phone: phone });
      if (contact_) {
        return res.status(400).json({ msg: 'phone number already exist' });
      }

      if (password.length < 4) {
        return res
          .status(400)
          .json({ msg: 'password should be 8 or more characters' });
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const newAdmin = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        password: hashedPassword,
        estate_id: req.body.estate_id,
        role: 'ADMIN',
        user_id: user_id,
      });

      console.log(newAdmin);

      if (!newAdmin) {
        return res
          .status(400)
          .json({ message: 'Invalid Admin email or does not exist' });
      }

      await newAdmin.save();

      res.status(201).json({
        message: 'Admin created and added to the estate successfully',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // get Admins
  app.get('/admin', async (req, res) => {
    try {
      const admins = await User.find({ role: 'ADMIN' }).populate('estate_id');

      res.status(200).json(admins);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/users', avatar, async (req, res) => {
    try {
      const existingUserCount = await User.countDocuments();

      if (!req.file) {
        return res.status(400).json({ message: 'Avatar is required' });
      }

      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

      
      const data = await handleUpload(dataURI);

      const {
        user_id,
        firstname,
        lastname,
        street,
        occupation,
        residence_id,
        status_id,
        created,
        address,
        other_status,
        house_number,
        identificationCode,
        email,
        password,
        phone,
      } = req.body;

    

      const user = await User.findById(user_id);

      if (!user || user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Only Admin can create users' });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ msg: 'Email format is not valid' });
      }

      const acc = await User.findOne({ email: email });
      if (acc) {
        return res.status(400).json({ msg: 'Email already exists' });
      }

      const contact = await User.findOne({ phone: phone });
      if (contact) {
        return res.status(400).json({ msg: 'Phone number already exists' });
      }

      if (password.length < 4) {
        return res
          .status(400)
          .json({ msg: 'Password should be 4 or more characters' });
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        user_id,
        firstname,
        lastname,
        phone,
        password: hashedPassword,
        occupation,
        street,
        other_status,
        house_number,
        email,
        avatar: data.url,
        residence_id,
        status_id,
        address,
        created,
        identificationCode: existingUserCount + 1,
        role: 'USER',
      });

      

      await newUser.save();

      res.status(201).json({
        message: 'User created and added to the estate successfully',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/users', async (req, res) => {
    try {
      const loggedInAdminId = req.query.user_id;

      const users = await User.find({
        role: 'USER',
        user_id: loggedInAdminId,
      });

      

      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
    
  });

  

  app.get('/users/total', async (req, res) => {
    try {
      const userCount = await User.countDocuments({ role: 'USER' });

      res.json(userCount);
    } catch (err) {
      console.log(err);
      res.send('Error fetching user count');
    }
  });

  app.get('/users/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findOne({ _id: userId, role: 'USER' });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/users/:id', async (req, res) => {
    try {
      if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Permission denied' });
      }

      const userId = req.params.id;
      const updatedUserData = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updatedUserData,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Delete Estate
  app.delete('/estate/:estateId', async (req, res) => {
    try {
      const { estateId } = req.params;
      const user_id = req.body.superAdminId;

      const user = await User.findById(user_id);

      if (!user || user.role !== 'SUPER ADMIN') {
        return res
          .status(403)
          .json({ message: 'Only super-Admin can delete estate' });
      }

      const estate = await Estate.findById(estateId);
      if (!estate) {
        return res.status(404).json({ messgae: 'Estate not found' });
      }

      await estate.remove();

      res.json({ message: 'Estate deleted successfully' });
    } catch (error) {
      console.error('Error deleting Estate:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  //  Delete Admin by Super-admin
  app.delete('/admin/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findById(id);
      if (!user || user.role !== 'SUPER ADMIN') {
        return res
          .status(403)
          .json({ message: 'Only super-admin can delete admin' });
      }

      const admin = await User.findById(id);
      if (!admin || admin.role !== 'ADMIN') {
        return res.status(404).json({ message: 'Admin not found' });
      }

      await admin.remove();

      res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
      console.error('Error deleting Admin:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Delete Users by Admin
  app.delete('/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id } = req.body;

      const user = await User.findById(user_id);
      if (!user || user.role !== 'ADMIN') {
        return res
          .status(403)
          .json({ message: 'Only admins can delete users...' });
      }

      const deletedUser = await User.findByIdAndRemove(id);

      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Respond with a success message
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

const validateEmail = (email) => {
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailReg.test(email);
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: '10d' });
};

const createAccessToken = (payload) => {
  // console.log(process.env.ACCESS_TOKEN);
  return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
};

module.exports = routes;
