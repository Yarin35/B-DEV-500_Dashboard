const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../../config/db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "http://localhost:3001/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const [rows] = await db.execute(
          "SELECT * FROM users WHERE google_id = ?",
          [profile.id]
        );

        if (rows.length > 0) {
          return done(null, rows[0]);
        } else {
          const [result] = await db.execute(
            "INSERT INTO users (username, email, google_id) VALUES (?, ?, ?)",
            [profile.displayName, profile.emails[0].value, profile.id]
          );
          const [newUser] = await db.execute(
            "SELECT * FROM users WHERE id = ?",
            [result.insertId]
          );
          return done(null, newUser[0]);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    done(null, rows[0]);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;