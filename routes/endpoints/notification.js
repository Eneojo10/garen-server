const Notification = require('../../models/notification');

  

const routes = function (app) {

  app.get('/notifications/:userId', async (req, res) => {
    try {
      const userId = req.params.user_id;
      const unreadNotifications = await Notification.find({
        userId,
        isRead: false,
        responded: false,
      });
      res.json(unreadNotifications);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({
          error: 'An error occurred while fetching unread notifications.',
        });
    }
  });

  app.post('/notifications', async (req, res) => {
    try {
      const { user_id, message } = req.body;
      const notification = new Notification({ user_id, message });
      await notification.save();

      res.json(notification);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'An error occurred while creating a notification.' });
    }
  });

  app.put('/notifications', async(req, res) => {
    try {
      const notificationId = req.params.notificationId;
      const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
      );
      res.json(notification);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({
          error: 'An error occurred while updating notification status.',
        });
    }
  })
}
module.exports = routes;
