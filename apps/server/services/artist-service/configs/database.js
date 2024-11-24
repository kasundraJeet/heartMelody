const {db_url} = require('./config.js')
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${db_url}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}.cyan.underline`);
  } catch (error) {
    console.error(`Error: ${error.message}.red.bold`);
    process.exit(1);
  }
};

module.exports = connectDB;