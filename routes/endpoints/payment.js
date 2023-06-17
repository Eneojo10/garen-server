const Payment = require('../../models/payment');


const routes = function (app) {
  app.get('/payments', async (req, res) => {
    try {
      let payments = await Payment.find();
      res.json(payments);
    } catch (err) {
      res.send('Error fetching URL');
    }
  });

  app.post('/payments', async (req, res) => {
    try {
      let payments = new Payment(req.body);
      await payments.save();

      res.json({ msg: 'data saved', code: 200 });
    } catch (err) {
      console.log(err);
      res.send('server error occurs');
    }
  });
};

module.exports = routes;
