require("dotenv").config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  googleClientID: "your_google_client_id",
  googleClientSecret: "your_google_client_secret",
  admin:{
    email: process.env.ADMIN_ID,
    pass: process.env.ADMIN_PASS
  },
  db: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    dialect: "mysql",
  },
};
