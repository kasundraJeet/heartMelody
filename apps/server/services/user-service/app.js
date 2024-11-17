require("dotenv").config();
const express = require('express');
const cors = require('cors');
const multer = require("multer");
const bodyParser = require('body-parser');
const authRouter = require('./src/routers/authRouter');
const sequelize = require("./configs/database");
require("./src/models/associations");

const app = express();

const upload = multer();
app.use(upload.none());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());


app.use('/api/auth', authRouter);


app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((error) => {
    console.error("Error synchronizing models:", error);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server started on port 3000');
});
