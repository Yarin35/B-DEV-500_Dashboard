const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../../config/db");
const bcrypt = require("bcrypt");
const secretKey = "secret";
const passport = require("passport");
const { OAuth2Client } = require("google-auth-library");

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_ID);

router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [existingUser] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      // If user already exists, update the password and username
      await db.execute(
        "UPDATE users SET username = ?, hashed_password = ? WHERE id = ?",
        [username, hashedPassword, existingUser[0].id]
      );
      const token = jwt.sign(
        { id: existingUser[0].id, username: existingUser[0].username },
        secretKey,
        { expiresIn: "1h" }
      );
      res.json({ token, userId: existingUser[0].id });
    } else {
      // Create a new user
      const [result] = await db.execute(
        "INSERT INTO users (username, email, hashed_password) VALUES (?, ?, ?)",
        [username, email, hashedPassword]
      );
      const userId = result.insertId;

      const [freeServices] = await db.execute(
        "SELECT id FROM services WHERE requires_auth = false"
      );
      const userServices = freeServices.map((service) => [userId, service.id]);
      if (userServices.length > 0) {
        await db.query(
          "INSERT INTO user_services (user_id, service_id) VALUES ?",
          [userServices]
        );
      }

      const token = jwt.sign({ id: userId, username }, secretKey, {
        expiresIn: "1h",
      });
      res.status(201).json({ token, userId: userId });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering user");
  }
});

router.post("/google/login", async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_ID,
        });
        const payload = ticket.getPayload();
        const { sub, email, name } = payload;

        const [rows] = await db.execute("SELECT * FROM users WHERE google_id = ?", [sub]);

        if (rows.length > 0) {
            const user = rows[0];
            const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: "24h" });
            res.json({ token, userId: user.id });
        } else {
            const [result] = await db.execute(
                "INSERT INTO users (username, email, google_id) VALUES (?, ?, ?)",
                [name, email, sub]
            );
            const userId = result.insertId;
            const token = jwt.sign({ id: userId, username: name }, secretKey, { expiresIn: "24h" });
            res.status(201).json({ token, userId });
        }
    } catch (error) {
        console.error("Error logging in: ", error);
        res.status(500).send("Error logging in");
    }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length > 0) {
      const user = rows[0];
      const isPasswordValid = await bcrypt.compare(
        password,
        user.hashed_password
      );

      if (isPasswordValid) {
        const token = jwt.sign(
          { id: user.id, username: user.username },
          secretKey,
          { expiresIn: "1h" }
        );
        res.json({ token });
      } else if (user.google_id) {
        await db.execute("UPDATE users SET hashed_password = ? WHERE id = ?", [
          await bcrypt.hash(password, 10),
          user.id,
        ]);
        const token = jwt.sign(
          { id: user.id, username: user.username },
          secretKey,
          { expiresIn: "1h" }
        );
        res.json({ token });
      } else {
        res.status(401).send("Invalid credentials");
      }
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    console.log("Error logging in: ", error);
    res.status(500).send("Error logging in");
  }
});

// Route pour la connexion avec Google
router.get(
  "/google/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/login/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      const token = jwt.sign(
        { id: req.user.id, username: req.user.username },
        secretKey,
        { expiresIn: "24h" }
      );
      const redirectUrl = `http://localhost:3000/oauth-callback?token=${token}&userId=${req.user.id}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error logging in");
    }
  }
);

router.get("/google", (req, res) => {
  const { serviceId, userId, dashboardId } = req.query;
  const state = `${serviceId},${userId},${dashboardId}`;
  const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&response_type=code&scope=email profile https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/calendar.readonly&state=${state}&access_type=offline&prompt=consent`;
  res.json({ authUrl });
});

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      const state = req.query.state ? req.query.state.split(",") : null;
      const serviceId = state ? state[0] : null;
      const userId = state ? state[1] : req.user.id;
      const dashboardId = state ? state[2] : null;

      const token = jwt.sign(
        { id: req.user.id, username: req.user.username },
        secretKey,
        { expiresIn: "24h" }
      );

      console.log('user is: ', req.user);
      // Store the access token and refresh token in the database
      await db.execute(
        "UPDATE users SET access_token = ?, refresh_token = ? WHERE id = ?",
        [req.user.access_token, req.user.refresh_token, req.user.id]
      );

      // Add the service to the user_services table
      if (serviceId) {
        await db.execute(
          "INSERT INTO user_services (user_id, service_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE service_id = service_id",
          [userId, serviceId]
        );
      }

      let redirectUrl;
      if (state) {
        redirectUrl = `http://localhost:3000/oauth-callback?token=${token}&userId=${req.user.id}&accessToken=${req.user.access_token}&dashboardId=${dashboardId}`;
      } else {
        redirectUrl = `http://localhost:3000/oauth-callback?token=${token}&userId=${req.user.id}`;
      }

      console.log('url is:', redirectUrl);
      res.redirect(redirectUrl);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error logging in");
    }
  }
);

module.exports = router;