const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = require('express').Router();

require('dotenv').config();
//Register
const routes = function (router) {
  router.post('/auth/create', async (req, res) => {
    try {
      const { fullname, email, password, phone, isAdmin } = req.body;

      if (!fullname || !email || !password || !phone || !isAdmin)
        return res.status(400).json({ msg: 'one or more fields are empty' });

      if (!validateEmail(email))
        return res.status(400).json({ msg: 'email format is not valid' });

      const acct = await User.findOne({ email: email });
      if (acct) return res.status(400).json({ msg: 'email already exist' });

      const full_name = await User.findOne({ fullname: fullname });
      if (full_name)
        return res.status(400).json({ msg: 'username already exist' });
      const contact = await User.findOne({ phone: phone });
      if (contact) return res.status(400).json({ msg: 'phone number already exist'})
      if (password.length < 4)
        return res
          .status(400)
          .json({ msg: 'password should be 8 or more characters' });

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        fullname,
        email,
        password: hashedPassword,
      });

      const access_token = createAccessToken({ id: newUser._id });

      const refresh_token = createRefreshToken({ id: newUser._id });

      res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: '/api/refresh_token',
        expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1),
        secure: true,
      });

      await newUser.save();
      
      res.json({
        msg: 'registration successful',
        access_token,
        user: {
          ...newUser._doc,
          password: '',
        },
      });
    } catch (error) {
      res.status(500).json({ msg: 'internal server failure' });
    }
  });

  router.post('/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(400).json({ msg: 'invalid credentials' });

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'user does not exist' });

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ msg: 'Server error occurs' });
        }

        if (!result) {
          return res.status(401).json({ msg: 'wrong password' });
        }
      });

      const access_token = createAccessToken({ userId: user._id });

      const refresh_token = createRefreshToken({ userId: user._id });

      // console.log(refresh_token);
      res.cookie('refreshtoken', refresh_token, {
        httpOnly: true,
        path: 'api/refresh_token',
        expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1),
        secure: true,
      });

      res.json({
        msg: 'login sucessful',
        access_token,
        user: {
          ...user._doc,
          password: '',
        },
      });
    } catch (err) {
      return res.status(400).json({ msg: 'interval server error' });
    }
  });
};

router.post('/refresh_token', async (req, res) => {
  try {
    const rf_token = req.cookies.persontoken;
    if (!rf_token) return res.status(400).json({ mg: 'please login now' });

    jwt.verify(rf_token, process.env.REFRESH_TOKEN, async (err, result) => {
      if (err) return res.status(400).json({ msg: 'please login now' });

      const user = await User.findById(result.id).select('-password');

      if (!user) return res.status(400).json({ msg: 'admin not found' });

      const access_token = createAccessToken({ id: result.id });

      res.json({
        access_token,
        user,
      });
    });
  } catch (err) {
    return res.status(400).json({ msg: 'unathourised access' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    res.clearCookie('refreshtoken', { path: 'api/refresh_token' });
    return res.json({ msg: 'Logged out' });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

const validateEmail = (email) => {
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailReg.test(email);
};

const createAccessToken = (payload) => {
  // console.log(process.env.ACCESS_TOKEN);
  return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: '10d' });
};

module.exports = routes;
