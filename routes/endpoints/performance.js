const Performance = require('../../models/performance');
const axios = require('axios');

const routes = function (app) {
  app.get('/performance', async (req, res) => {
    try {
      const performances = await Performance.find();
      const performanceData = {
        months: performances.map((p) => p.month),
        scores: performances.map((p) => p.score),
      };
      res.json(performanceData);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      res.status(500).json({ error: 'Failed to fetch performance data' });
    }
  });

  // app.get('/performance-external', async (req, res) => {
  //   try {
  //     const response = await axios.get('http://localhost:5000/performance');
  //     const performanceData = response.data;
  //     res.json(performanceData);
  //   } catch (error) {
  //     console.error('Error fetching performance data:', error);
  //     res.status(500).json({ error: 'Failed to fetch performance data' });
  //   }
  // });
};

module.exports = routes;
