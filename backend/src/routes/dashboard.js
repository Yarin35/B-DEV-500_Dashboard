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

// Get a specific dashboard
router.get('/:id/content', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM dashboard WHERE id = ?', [id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).send('Dashboard not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching dashboard');
  }
});

// Update a dashboard
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { content } = req.body;
  try {
    const [existingContent] = await db.execute('SELECT * dashboard WHERE id = ?', [id]);

    if (existingContent.length > 0) {
      await db.execute('UPDATE dashboard SET content = ? WHERE id = ?', [content, id]);
    } else {
      await db.execute('INSERT INTO dashboard VALUES (?, ?, ?)', [id, name, content]);
    }
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

router.post('/:id/widgets', async (req, res) => {
  const { id } = req.params;
  const { widgetId } = req.body;

  try {
    await db.execute(
      'INSERT INTO dashboard_widgets (dashboard_id, widget_id) VALUES (?, ?)',
      [id, widgetId]
    );
    res.status(201).send('Widget added to dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding widget to dashboard');
  }
});

router.get('/:id/widgets', async (req, res) => {
  const { id } = req.params; // This is the dashboard_id

  try {
    const [widgets] = await db.execute(
      'SELECT w.* FROM widgets w JOIN dashboard_widgets dw ON w.id = dw.widget_id WHERE dw.dashboard_id = ?',
      [id]
    );
    res.json(widgets);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching widgets for dashboard');
  }
});

module.exports = router;