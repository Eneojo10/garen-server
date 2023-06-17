const User = require("../../models/user")


const routes = function(app) {
  app.post('/forgot-password', async (req, res) => {

    const user = await User.findOne({email: req.body.email});

    if(!user) {
      return res.status(404).json({msg: 'Admin not found'});
    }

    const resetToken = bcrypt.randomBytes(20).toString('hex');

    user.resetToken = resetToken;

    user.resetTokenExpires = Data.now() + 3600000;

    await user.save();

    const resetLink = `http:localhost:5007/reset-password/${resetToken}`;

    res.json({msg: 'Reset link sent'});
  });



  app.post('/reset-password/:token', async (req, res) => {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExpires: {$gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({msg: 'Invalid'})
    }

    user.password = req.body.password;
    user.resetToken = null;
    user.resetTokenExpires = null;

    await user.save();

    res.json({msg: 'Password reset successfully'})
  });
}
module.exports = routes;