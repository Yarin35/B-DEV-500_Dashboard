const express = require('express');
const db = require('../../../config/db');
const router = express.Router();

// Get all Weather widgets
router.get('/', async (req, res) => {
    try {
        const [services] = await db.execute('SELECT * FROM services WHERE name = "Weather"');
        res.json(services);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching Weather services');
    }
});