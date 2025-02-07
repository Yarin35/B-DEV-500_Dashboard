const db = require('../../config/db');
const servicesConfig = require('../config/servicesConfig');

const populateDatabase = async () => {
  try {
    const [services] = await db.execute('SELECT COUNT(*) as count FROM services');
    if (services[0].count === 0) {
      for (const service of servicesConfig) {
        const [result] = await db.execute(
          'INSERT INTO services (name, description, requires_auth) VALUES (?, ?, ?)',
          [service.name, service.description, service.registration_required]
        );
        const serviceId = result.insertId;
        for (const widget of service.widgets) {
          await db.execute(
            'INSERT INTO widgets (name, config, service_id) VALUES (?, ?, ?)',
            [widget.name, JSON.stringify(widget.config), serviceId]
          );
        }
      }
      console.log('Database populated with initial services and widgets');
    }
  } catch (error) {
    console.error('Error populating database:', error);
  }
};

module.exports = populateDatabase;