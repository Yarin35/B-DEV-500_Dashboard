const express = require("express");
const db = require("../../config/db.js");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [widgets] = await db.execute("SELECT * FROM widgets");
    res.json(widgets);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching widgets");
  }
});

router.get("/srvice/:serviceId/widgets", async (req, res) => {
  const { serviceId } = req.params;
  try {
    const [widgets] = await db.execute(
      "SELECT * FROM widgets WHERE service_id = ?",
      [serviceId]
    );
    res.json(widgets);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching widgets");
  }
});

router.get("/:widgetId/config", async (req, res) => {
  const { widgetId } = req.params;
  try {
    const [widget] = await db.execute(
      "SELECT config FROM widgets WHERE id = ?",
      [widgetId]
    );
    if (widget.length > 0) {
      res.json(widget[0].config);
    } else {
      res.status(404).send("Widget not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching widget config");
  }
});

router.get("/:dashboardId/widgets", async (req, res) => {
  const { dashboardId } = req.params;

  try {
    const [widgets] = await db.execute(
      `SELECT dw.*, w.name 
       FROM dashboard_widgets dw 
       JOIN widgets w ON dw.widget_id = w.id 
       WHERE dw.dashboard_id = ?`,
      [dashboardId]
    );
    res.json(widgets);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching widgets dashboard");
  }
});

module.exports = router;
