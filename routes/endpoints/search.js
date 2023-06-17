const Register = require('../../models/register');

const routes = function (app) {
  app.get('/search', async (req, res) => {
    const searchItem = req.query.term;

    try {
      const results = await Register.find({
        $or: [
          { surname: { $regex: searchItem, $options: 'i' } },
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
