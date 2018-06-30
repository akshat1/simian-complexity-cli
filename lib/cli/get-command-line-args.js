const commandLineArgs = require('command-line-args');
const { commandSpec } = require('./command-spec');

const reportGenerationTime = new Date();
let cliArgs;

const timeStamp = Date.now();

function getCommandLineArgs() {
  if (!cliArgs) {
    cliArgs = commandLineArgs(commandSpec);
  }

  return cliArgs;
}

module.exports = {
  getCommandLineArgs,
  getOutputDirectoryPath: () => getCommandLineArgs().out,
  getSourceDirectoryPath: () => getCommandLineArgs().src,
  getExcludes: () => getCommandLineArgs().exclude,
  isHelp: () => getCommandLineArgs().help,
  isVerbose: () => getCommandLineArgs().verbose,
  getReportName: () => getCommandLineArgs().name || String(timeStamp), // TODO: Try to get git commit hash. 
  reportGenerationTime,
};
