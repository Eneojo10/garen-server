const Residence = require('../../models/residence');

const routes = function (app) {
  app.get('/residence', async (req, res) => {
    try {
      let residence = await Residence.find();
      res.json(residence);
    } catch (err) {
      console.log(err);
      res.send('Error fetching URL');
    }
  });

  app.post('/residence', async (req, res) => {
    try {
      let residence = new Residence(req.body);
      await residence.save();
      res.status(400).json({ msg: 'data saved', code: 200 });
    } catch (err) {
      console.log(err);
      res.send('server error occurs');
    }
  });
};

module.exports = routes;
