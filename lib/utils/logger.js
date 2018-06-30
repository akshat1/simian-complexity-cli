const winston = require('winston');
const { format, createLogger, transports } = winston;

const baseConfig = {
  level: 'info',
  format: format.json(),
  transports: [
    new transports.File({ filename: 'combined.log' }),
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.Console(),
  ],
  exitOnError: false,
};

function makeFormat({ label = 'noName' }) {
  return format.combine(
    format.simple(),
    format.label({ label }),
    format.timestamp(),
  );
}

function getLogger({ label }) {
  return createLogger({
    ...baseConfig,
    format: makeFormat({ label })
  });
}

module.exports = {
  getLogger
};