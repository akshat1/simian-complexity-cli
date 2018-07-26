/**
 * @module lib/utils
 */
const winston = require('winston');
const { format, createLogger, transports } = winston;
const { isVerbose } = require('../cli');


const baseConfig = {
  level: isVerbose() ? 'debug' : 'info',  // Change to verbose before release.
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

/**
 * Get a logger instance.
 *
 * @param {Object} args -
 * @param {string} args.label - A string label to be added to beginning of each log message output
 *                              from the logger returned from this.
 * @returns {Logger} - A Winston logger object.
 */
function getLogger({ label }) {
  return createLogger({
    ...baseConfig,
    format: makeFormat({ label })
  });
}

module.exports = {
  getLogger
};