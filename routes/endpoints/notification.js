const Notification = require('../../models/notification');


const routes = function(app) {
  app.get('/notifications/:adminId', async (req, res) => {
    const {adminId} = req.params;
    try {
      let notifications = await Notification.find({ recipient: adminId});
      res.json(notifications)
    }catch(err) {
      console.log(err)
      res.send('Error fetching URL')
    }
  });

  app.post('/notifications', async (req, res) => {

    const { recipient, message } = req.body;

    try {
      
      let notifications = new Notification({ recipient, message});
      await notifications.save();
      res.json(notifications)
    }catch (err) {
      console.log(err)
      res.send('Error fetching URL')
    }
  });

}
module.exports = routes;
