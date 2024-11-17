const { DataTypes } = require('sequelize');
const sequelize = require('../configs/database');  // Make sure to configure Sequelize

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2
  },
  profile_picture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fcm: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = User;
