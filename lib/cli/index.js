const cli = require('./get-command-line-args');
const { printUsageGuide } = require('./print-usage-guide');

module.exports = {
  ...cli,
  printUsageGuide,
};
