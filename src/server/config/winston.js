const appRoot = require('app-root-path');
const winston = require('winston');

const env = process.env.NODE_ENV;

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    silent: env === 'test',
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    format: winston.format.json(),
    silent: env === 'test',
  }
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
  write: (message, encoding) => {
    logger.info(message);
  },
};

module.exports = logger;
