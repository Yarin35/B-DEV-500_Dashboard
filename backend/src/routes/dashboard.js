const express = require('express');
const db = require('../../config/db');
const populateDB = require('../utils/populateDB.js');
const router = express.Router();

router.use(async (req, res, next) => {
  await populateDB();
  next();
});

// Create a new dashboard
router.post('/', async (req, res) => {
  const { name, userId } = req.body;
  try {
    const [result] = await db.execute('INSERT INTO dashboard (name, user_id) VALUES (?, ?)', [name, userId]);
    res.status(201).json({ id: result.insertId, name, userId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating dashboard');
  }
});

// Get all dashboards for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM dashboard WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching dashboards');
  }
});

// Update a dashboard
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await db.execute('UPDATE dashboard SET name = ? WHERE id = ?', [name, id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating dashboard');
  }
});

// Delete a dashboard
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM dashboard WHERE id = ?', [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting dashboard');
  }
});

module.exports = router;