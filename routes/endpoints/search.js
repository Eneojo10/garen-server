const Register = require('../../models/register');

const routes = function (app) {
  app.get('/search/:term', async (req, res) => {
    const searchItem = req.params.term;

    try {
      const results = await Register.find({
        $or: [
          { firstname: { $regex: searchItem, $options: 'i' } },
          { lastname: { $regex: searchItem, $options: 'i' } },
          { email: { $regex: searchItem, $options: 'i' } },
          
        ],
      });

      res.json(results);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred while searching.' });
    }
  });
};

module.exports = routes;
