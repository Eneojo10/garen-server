const User = require('../../models/user');
const router = require('express').Router();

  router.get('/users/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) return res.status(400).json({ msg: 'user does not exist' });

      res.json({ user });
    } catch (error) {
      return res.status(500).json({ error: 'internal server error' });
    }
  });

  


// app.post('/users', async (req, res) => {
//   const { name, email, phone, password, isAdmin } = req.body;

//   const newUser = new User({
//     name,
//     email,
//     phone,
//     password,
//     isAdmin,
//   });

//   newUser.save((err) => {
//     if (err) {
//       console.error('Error saving user:', err);
//       return res.status(500).json({ error: 'Failed to register user.' });
//     }
//     return res.status(200).json({ message: 'User registered successfully.' });
//   });
// });
module.exports = router;
