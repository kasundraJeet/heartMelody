const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("./utils/passportConfig");
const userRoutes = require("./routes/userRoutes");
const db = require("./models");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users", userRoutes);

db.sequelize.sync().then(() => {
  console.log("Database connected");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
