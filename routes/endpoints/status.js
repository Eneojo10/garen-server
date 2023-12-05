const Status = require('../../models/status');

const routes = function (app) {
  app.get('/status', async (req, res) => {
    try {
      let status = await Status.find();
      res.json(status);
    } catch (error) {
      console.log(err);
      res.send('Error fetching Url');
    }
  });

  app.post('/status', async (req, res) => {
    try {
      let status = new Status(req.body);
      await status.save();
      res.status(400).json({ msg: 'data saved', code: 200 });
    } catch (err) {
      console.log(err);
      res.send('server error occurs');
    }
  });

  // app.put('/status/:id', async (req, res) => {
  //   try {
  //     const statusId = req.params.id;
  //     const { surname, email, phone, address } = req.body;

  //     const existingStatus = await Status.findById(statusId);
  //     if (!existingRes) {
  //       return res.status(404).json({ error: 'Residence not found' });
  //     }

  //     existingResidence.surname = surname;
  //     existingResidence.email = email;
  //     existingResidence.phone = phone;
  //     existingResidence.address = address;

  //     const updtatedResidence = await existingResidence.save();

  //     res.json(updtatedResidence);
  //   } catch (error) {
  //     console.error('Error updating item');
  //     res.send('Internal server error');
  //   }
  // });

  // app.delete('/residence/:id', async (req, res) => {
  //   try {
  //     const residenceId = req.params.id;

  //     const existingResidence = await Residence.findById(residenceId);
  //     if (!existingResidence) {
  //       return res.status(404).json({ error: 'Residence not found' });
  //     }

  //     await Residence.findByIdAndRemove(residenceId);

  //     res.json({ message: 'Residence deleted! ' });
  //   } catch (error) {
  //     console.error('Error deleting item:', error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // });
};

module.exports = routes;
