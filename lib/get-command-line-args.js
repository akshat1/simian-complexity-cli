const commandLineArgs = require('command-line-args');
const { commandSpec } = require('./command-spec');

let cliArgs;


function getCommandLineArgs() {
  if (!cliArgs) {
    cliArgs = commandLineArgs(commandSpec);
  }

  return cliArgs;
}

module.exports = { getCommandLineArgs };
