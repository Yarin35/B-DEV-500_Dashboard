const express = require('express');
const db = require('../../../config/db');
const router = express.Router();

// Get all Google services
router.get('/', async (req, res) => {
  try {
    const [services] = await db.execute('SELECT * FROM services WHERE name = "Google"');
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching Google services');
  }
});

// Get Google services for a user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [userServices] = await db.execute(
      'SELECT s.* FROM services s JOIN user_services us ON s.id = us.service_id WHERE us.user_id = ? AND s.name = "Google"',
      [userId]
    );
    res.json(userServices);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user Google services');
  }
});

module.exports = router;