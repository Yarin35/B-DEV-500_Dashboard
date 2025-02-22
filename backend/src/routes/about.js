const express = require('express');
const router = express.Router();
const services = require('../config/servicesConfig');

router.get('/', (req, res) => {
  const aboutInfo = {
    client: {
      host: req.ip
    },
    server: {
      current_time: Math.floor(Date.now() / 1000),
      services: services.map(service => ({
        name: service.name,
        widgets: service.widgets.map(widget => ({
          name: widget.name,
          description: widget.config.description || '',
          params: widget.config.fields.map(field => ({
            name: field,
            type: typeof field === 'string' ? 'string' : 'integer'
          }))
        }))
      }))
    }
  };

  res.json(aboutInfo);
});

module.exports = router;