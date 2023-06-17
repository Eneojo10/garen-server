const Configuration = require('../../models/configuration');



const routes = function(app) {
  app.get('/config', async (req, res) => {
    try {
      let config = await Configuration.find();
      res.json(config);
    }catch (err) {
      console.log(err)
      res.send('Error fetching URL')
    }
  });


  app.post('/config', async (req, res) => {
    try {
      let config = new Configuration(req.body);
      await config.save();
      res.json({msg: 'data saved', code: 200})
    }catch (err) {
      console.log(err)
      res.send('server error occurs')
    }
  })
}

module.exports = routes;