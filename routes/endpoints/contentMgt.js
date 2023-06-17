const contentMgt = require('../../models/contentMgt');


const routes = function(app) {
  app.get('/contents', async(req, res) => {
    try {
      let contents = await contentMgt.find();
      res.json(contents)
    }catch(err) {
      console.log(err)
      res.send('Error fetching URL')
    }
  });


  app.post('/contents', async(req, res) => {
    try {
      let contents = new contentMgt(req.body);
      await contents.save();
      res.status().json({msg: 'data saved', code:200})
    }catch(err) {
      console.log(err)
      res.send('Error fetching URL')
    }
  });
}

module.exports = routes;