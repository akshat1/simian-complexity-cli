const commandLineArgs = require('command-line-args');

let cliArgs;

function getCommandLineArgs() {
  if (!cliArgs) {
    cliArgs = commandLineArgs([
      { name: 'verbose', alias: 'v', type: Boolean },
      { name: 'src', alias: 's', type: String, multiple: true },
      { name: 'glob', alias: 'g', type: String, multiple: true },
      { name: 'out', alias: 'o', defaultValue: '.simian-complexity-data' },
      { name: 'help', type: Boolean },
    ]);
  }

  return cliArgs;
}

module.exports = { getCommandLineArgs };
