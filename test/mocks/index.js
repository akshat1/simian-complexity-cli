const cli = require('./cli');
const fs = require('./fs');
const logger = require('./logger');
const mockery = require('./mockery');
const utils = require('./utils');

module.exports = {
  ...cli,
  ...fs,
  ...logger,
  ...mockery,
  ...utils,
};
