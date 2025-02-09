const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth");
const dashboardRouter = require("./routes/dashboard");
const servicesRouter = require("./routes/services");
const widgetsRouter = require("./routes/widgets.js");
const googleWidgetsRouter = require("./routes/widgets/google.js");
const weatherWidgetsRouter = require("./routes/widgets/weather.js"); // Ajoutez cette ligne
const bodyParser = require("body-parser");
const passport = require("./config/passport");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Cross-Oirigin-Openeer-Policy", "same-origin");
  res.setHeader("Cross-Oirigin-Embedder-Policy", "reqauire-corp");
  next();
});


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
app.use("/widgets", widgetsRouter);
app.use("/widgets/", googleWidgetsRouter);
app.use("/widgets/", weatherWidgetsRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
