const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../../config/db");

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/youtube",
      "https://www.googleapis.com/auth/youtube.force-ssl",
      "https://www.googleapis.com/auth/calendar.readonly",
    ],
    accessType: "offline",
    prompt: "consent",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM users WHERE google_id = ?",
        [profile.id]
      );

      if (rows.length > 0) {
        // Update the access token and refresh token for the existing user
        await db.execute(
          "UPDATE users SET access_token = ?, refresh_token = ? WHERE google_id = ?",
          [accessToken, refreshToken || rows[0].refresh_token, profile.id]
        );
        const [updatedUser] = await db.execute(
          "SELECT * FROM users WHERE google_id = ?",
          [profile.id]
        );
        updatedUser[0].accessToken = accessToken; // Add access token to user object
        updatedUser[0].refreshToken = refreshToken; // Add refresh token to user object
        return done(null, updatedUser[0]);
      } else {
        const [result] = await db.execute(
          "INSERT INTO users (username, email, google_id, access_token, refresh_token) VALUES (?, ?, ?, ?, ?)",
          [
            profile.displayName,
            profile.emails[0].value,
            profile.id,
            accessToken,
            refreshToken,
          ]
        );
        const [newUser] = await db.execute("SELECT * FROM users WHERE id = ?", [
          result.insertId,
        ]);
        newUser[0].accessToken = accessToken; // Add access token to user object
        newUser[0].refreshToken = refreshToken; // Add refresh token to user object
        return done(null, newUser[0]);
      }
    } catch (error) {
      return done(error, null);
    }
  }
);

module.exports = googleStrategy;