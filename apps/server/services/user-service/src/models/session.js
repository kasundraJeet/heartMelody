const { DataTypes } = require('sequelize');
const sequelize = require('../../configs/database');

const Session = sequelize.define('Session', {
  session_id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  session_email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  session_token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  session_expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  session_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  session_user_role: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_fcm_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  session_otp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  session_otp_expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  session_is_verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
});

module.exports = Session;
