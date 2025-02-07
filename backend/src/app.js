const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth");
const dashboardRouter = require("./routes/dashboard");
const servicesRouter = require("./routes/services");
const bodyParser = require("body-parser");
const passport = require("./config/passport");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is ready!");
});

app.use(bodyParser.json());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/dashboard", dashboardRouter);
app.use("/services", servicesRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
