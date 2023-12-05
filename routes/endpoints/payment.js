const Payment = require('../../models/payment');
const jwt = require('jsonwebtoken');
const secretKey = 'SECRET_KEY';

const routes = function (app) {
  app.get('/payments', async (req, res) => {
    try {
      let { sort, year } = req.query;
      let payments;

      if (sort === 'dueDate') {
        payments = await Payment.find().sort({ dueDate: 1 });
      } else if (sort === 'paymentDate') {
        payments = await Payment.find().sort({ paymentDateFrom: 1 });
      } else if (sort === 'paymentDateTo') {
        payments = await Payment.find().sort({ paymentDateTo });
      } else if (sort === 'email') {
        payments = await Payment.find().sort({ email });
      } else if (sort === 'firstname') {
        payments = await Payment.find().sort({ firstname });
      } else if (year) {
        year = parseInt(year);
        payments = await Payment.find({ year });
      } else {
        payments = await Payment.find();
      }

      // let arr = [];
      let months = [];
      let months_data = [];
      for (let i = 0; i < payments.length; i++) {
        let payment = payments[i];
        let index = 0;
        if (!months.includes(payment.period_from)) {
          months.push(payment.period_from);
          months_data.push(payment.amount / 1000);
          index = months_data.length;
        } else {
          index = months.indexOf(payment.period_from);
          months_data[index] += payment.amount / 1000;
          // months_data[index] = months_data[index] / 1000;
        }
      }

      // for (let i = 0; i < months.length; i++) {
      //   let name = months[i];
      //   let amount = months_data[i];
      //   arr.push({
      //     name,
      //     amount,
      //   });
      // }

      res.json({
        labels: months,
        data: months_data,
      });
    } catch (err) {
      res.send('Error fetching URL');
    }
  });

  app.get('/payments/all', async (req, res) => {
    try {
      const loggedInAdminId = req.query.user_id;

      const payments = await Payment.find({ user_id: loggedInAdminId }).lean();
      res.json(payments);
    } catch (err) {
      console.error('Error getting payments:', err);
      res.status(500).json({ msg: 'Internal server error' });
    }
  });

  app.get('/payments/active-count', async (req, res) => {
    try {
      const activePayments = await Payment.countDocuments();
      res.json({ activePayments });
    } catch (error) {
      console.error('Error fetching active payments count:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/payments/:id', async (req, res) => {
    try {
      const payments = await Payment.findById(req.params.id);
      if (!payments) {
        return res.status(404).json({ error: 'payment not found' });
      }
      res.json(payments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching payments' });
    }
  });

  app.post('/payments', async (req, res) => {
    try {
      // Extract payment data from the request body
      const {
        firstname,
        lastname,
        payment_date,
        service_type,
        period_from,
        to,
        due_date,
        amount,
        year,
        user_id,
      } = req.body;

      // Create a new Payment document using the model
      const newPayment = new Payment({
        firstname,
        lastname,
        payment_date,
        service_type,
        period_from,
        to,
        due_date,
        amount,
        year,
        user_id,
      });

      await newPayment.save();

      res.status(201).json(newPayment);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Server error occurred' });
    }
  });
  app.put('/payments/:id', async (req, res) => {
    try {
      const paymentId = req.params.id;
      const {
        fullname,
        payment_date,
        service_type,
        period_from,
        to,
        due_date,
      } = req.body;

      const existingPayment = await Payment.findById(paymentId);
      if (!existingPayment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      existingPayment.fullname = fullname;
      existingPayment.payment_date = payment_date;
      existingPayment.service_type = service_type;
      existingPayment.period_from = period_from;
      existingPayment.to = to;
      existingPayment.due_date = due_date;

      const updatedPayment = await existingPayment.save();

      res.json(updatedPayment);
    } catch (err) {
      console.err('Error updating payments:', err);
      res.status(500).json({ err: 'Internal server failure' });
    }
  });

  app.delete('/payments/:id', async (req, res) => {
    try {
      const paymentId = req.params.id;

      const existingPayment = await Payment.findById(paymentId);
      if (!existingPayment) {
        return res.status(404).json({ eror: 'Payment not found' });
      }

      await Payment.findByIdAndRemove(paymentId);

      res.json({ message: 'Payment Deleted' });
    } catch (error) {
      console.error('Error deleting payment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

module.exports = routes;
