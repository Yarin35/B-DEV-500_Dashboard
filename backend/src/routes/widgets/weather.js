const express = require('express');
const axios = require('axios');
const db = require('../../../config/db');
const router = express.Router();

router.get('/5/data', async (req, res) => {
  const { location } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: location,
        appid: apiKey
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching current weather:', error);
    res.status(500).send('Error fetching current weather');
  }
});

router.get('/6/data', async (req, res) => {
  const { location } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
      params: {
        q: location,
        appid: apiKey
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    res.status(500).send('Error fetching weather forecast');
  }
});

module.exports = router;