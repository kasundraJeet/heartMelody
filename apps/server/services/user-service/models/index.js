const { Sequelize } = require('sequelize');
const config = require('../config.json');

const sequelize = new Sequelize(config.development);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize);

module.exports = db;
