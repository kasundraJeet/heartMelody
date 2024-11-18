const winston = require('winston');

const errorLog = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    ],
});

const successLog = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: 'logs/success.log', level: 'info' }),
    ],
});

module.exports = { errorLog, successLog };