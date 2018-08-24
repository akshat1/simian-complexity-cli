const _ = require('lodash');
const { getLogger } = require('./logger');
const { printUsageGuide } = require('../cli');

const logger = getLogger({ label: 'ensureInputs' });

function ensureInputs(inputs) {
  if (_.isEmpty(inputs)) {
    logger.debug('Missing inputs.');
    printUsageGuide(new Error('Missing input'));
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }

  return inputs;
}

module.exports = { ensureInputs };
