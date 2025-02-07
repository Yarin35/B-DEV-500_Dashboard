const passport = require("passport");
const googleStrategy = require("./googleStrategy");
const db = require("../../config/db");

passport.use(googleStrategy);

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