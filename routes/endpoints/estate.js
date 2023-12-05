const Estate = require('../../models/estate');

const routes = function (app) {
  app.get('/estate', async (req, res) => {
    try {
      let estate = await Estate.find();
      res.json(estate);
    } catch (error) {
      console.log(err);
      res.send('Error fetching Url');
    }
  });

  app.post('/estate', async (req, res) => {
    try {
      let estate = new Estate(req.body);
      await estate.save();
      res.status(400).json({ msg: 'data saved', code: 200 });
    } catch (err) {
      console.log(err);
      res.send('server error occurs');
    }
  });

  
};

module.exports = routes;
