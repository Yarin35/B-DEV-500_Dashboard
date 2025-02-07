const express = require('express');
const services = require('../config/servicesConfig.js');
const db = require('../../config/db.js');
const router = express.Router();

// Add a new service
router.post('/add', async (req, res) => {
  const { name, description, registration_required } = req.body;

  if (!name || !description) {
    return res.status(400).send('Name and description are required');
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO services (name, description, registration_required) VALUES (?, ?, ?)',
      [name, description, registration_required]
    );
    res.status(201).json({ id: result.insertId, name, description, registration_required });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding service');
  }
});

// Get all services
router.get('/', (req, res) => {
  try {
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching services');
  }
});

// Get services for a user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [userServices] = await db.execute(
      'SELECT s.* FROM services s JOIN user_services us ON s.id = us.service_id WHERE us.user_id = ?',
      [userId]
    );
    res.json(userServices);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching user services');
  }
});

// Subscribe to a service
router.post('/subscribe', async (req, res) => {
  const { userId, serviceId } = req.body;

  if (!userId || !serviceId) {
    return res.status(400).send('User ID and service ID are required');
  }
  console.log('params are:', userId, serviceId);
  try {
    const [service] = await db.execute('SELECT * FROM services WHERE id = ?', [serviceId]);
    const [existingSubscription] = await db.execute('SELECT * FROM user_services WHERE user_id = ? AND service_id = ?', [userId, serviceId]);

    if (existingSubscription.length > 0 || service.length === 0) {
      return res.status(200).send('User already subscribed to service or service not found');
    }

    await db.execute('INSERT INTO user_services (user_id, service_id) VALUES (?, ?)', [userId, serviceId]);
    res.status(201).send('Subscribed to service');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error subscribing to service');
  }
});

// GET widgets for a service
router.get('/:serviceId/widgets', async (req, res) => {
  const { serviceId } = req.params;
  try {
    const [widgets] = await db.execute('SELECT * FROM widgets WHERE service_id = ?', [serviceId]);
    res.json(widgets);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching widgets');
  }
});

module.exports = router;