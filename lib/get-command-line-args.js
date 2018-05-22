const commandLineArgs = require('command-line-args');

function getCommandLineArgs() {
  return commandLineArgs([
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'src', type: String, multiple: true },
    { name: 'glob', type: String, multiple: true },
    { name: 'out', alias: 'o', defaultValue: '.simian-complexity-data' },
    { name: 'help' },
  ]);
}

module.exports = { getCommandLineArgs };
