// TODO utils.getReportFilePath uses getSourceDirectoryPath which uses utils.getCommit. Fix this circular dependency.
const commandLineArgs = require('command-line-args');
const { commandSpec } = require('./command-spec');
const { getCommit } = require('../utils/git');

const reportGenerationTime = new Date();
let cliArgs;

function getCommandLineArgs() {
  try {
    if (!cliArgs) {
      cliArgs = commandLineArgs(commandSpec);
    }

    return cliArgs;
  } catch(err) {
    // command-line-args freaks out if called when running tests, because it
    // encounters "unknown" flags (like --recursive). Eat the errors.
    /* istanbul ignore next */
    if(process.env.NODE_ENV === 'test') {
      return {};
    }
  }
}

const getExcludes = () => getCommandLineArgs().exclude;

const getOutputDirectoryPath = () => getCommandLineArgs().out;

async function getReportName() {
  if (getCommandLineArgs().name) {
    return getCommandLineArgs().name;
  }

  try {
    const commit = await getCommit(getSourceDirectoryPath());
    return `Git:${commit}`;
  } catch(err) {
    // Eat the error.
  }
  
  return reportGenerationTime.toTimeString();
}

const getSourceDirectoryPath = () => getCommandLineArgs().src;

const isHelp = () => getCommandLineArgs().help;

const isVerbose = () => getCommandLineArgs().verbose;

module.exports = {
  getCommandLineArgs,
  getExcludes,
  getOutputDirectoryPath,
  getReportName,
  getSourceDirectoryPath,
  isHelp,
  isVerbose,
  reportGenerationTime,
};
