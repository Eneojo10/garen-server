const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('express').Router();

require('dotenv').config();
//Login

const secretKey = process.env.SECRET_KEY || 'SECRET_KEY';

let superAdminPasswordHash = null;

const superAdminPassword = 'adminPassword';

const saltRounds = 10;
bcrypt.hash(superAdminPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    superAdminPasswordHash = hash;
  }
});

const createAccessToken = (payload) => {
  const token = jwt.sign(payload, process.env.ACCESS_TOKEN, {
    expiresIn: '5m',
  });

  return token;
};

const createRefreshToken = (payload) => {
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN, {
    expiresIn: '2d',
  });

  return token;
};
const routes = function (router) {
  router.post('/update-password', async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const passwordMatch = await bcrypt.compare(currentPassword, password);

      if (!passwordMatch) {
        return res
          .status(401)
          .json({ message: 'Current password is incorrect' });
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 8);

      password = hashedNewPassword;

      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.post('/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const user = await User.findOne({ email });

      if (!user) return res.status(404).json({ msg: 'User does not exist' });

      if (user.role === 'SUPER ADMIN') {
        if (user.password !== password)
          return res.status(500).json({ msg: 'Invalid credential' });

        const access_token = createAccessToken({
          role: 'SUPER-ADMIN',
          isSuperAdmin: true,
        });
        const refresh_token = createRefreshToken({ role: 'super-admin' });

        res.cookie('refreshtoken', refresh_token, {
          httpOnly: true,
          path: 'api/refresh_token',
          expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1),
          secure: true,
        });

        return res.json({
          msg: 'Super-admin login successful',
          access_token,
          role: 'SUPER ADMIN',
          user: {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
          },
        });
      }

      
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ msg: 'Server error occurs' });
        }

        // console.log('User Role:', user.role);
        // console.log('Hashed Password:', user.password);

        if (!result) {
          return res.status(401).json({ msg: 'Wrong password...' });
        }

        if (user.role === 'ADMIN') {
          const access_token = createAccessToken({
            role: 'ADMIN',
            isAdmin: true,
          });
          const refresh_token = createRefreshToken({ role: 'admin' });

          res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: 'api/refresh_token',
            expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1),
            secure: true,
          });
          return res.json({
            msg: 'Admin login successful',
            access_token: access_token,
            role: 'ADMIN',
            user: {
              ...user._doc,
              password: '',
            },
          });
        } else {
          const access_token = createAccessToken({ userId: user._id });
          const refresh_token = createRefreshToken({ userId: user._id });

          res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: 'api/refresh_token',
            expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1),
            secure: true,
          });

          res.json({
            msg: 'Login successful',
            access_token,
            role: 'USER',
            user: {
              ...user._doc,
              password: '',
            },
          });
        }
      });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ msg: 'Internal server error' });
    }
  });

  router.post('/refresh_token', async (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: 'please login now' });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN, async (err, result) => {
        if (err) return res.status(400).json({ msg: 'please login now' });

        const user = await User.findById(result.id).select('-password');

        if (!user) return res.status(400).json({ msg: 'User not found' });

        const access_token = createAccessToken({ userId: result.userId });

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
};

module.exports = routes;
