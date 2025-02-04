const express = require("express");
const passport = require("passport");
const { sequelize } = require("../models");
const routes = require("./routes/routes.js");
require("dotenv").config();
require("../config/passport")(passport);

const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use("/api", routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully");
  } catch (err) {
    console.log("Unable to connect to database", err);
  }
});
