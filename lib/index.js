// const escomplex = require('escomplex');
const _ = require('lodash');
const fs = require('./fs');
const { analyze } = require('./analyze');
const { getCommandLineArgs } = require('./get-command-line-args');
const { printUsageGuide } = require('./print-usage-guide');

// const escomplexOpts = {};

const cliArgs = getCommandLineArgs();

if (cliArgs.help) {
  printUsageGuide();
  process.exit(0);
}

function ensureInputs(inputs) {
  if (_.isEmpty(inputs)) {
    printUsageGuide(new Error('Missing input'));
    process.exit(1);
  }

  return inputs;
}

const sources = Array.from(cliArgs.src || []);

console.log(cliArgs);
fs.mkdir(cliArgs.out)
  .then(() => fs.expandGlobs(cliArgs.glob))
  .then(filePathsFromGlob => _.uniq(sources.concat(filePathsFromGlob)))
  .then(ensureInputs)
  .then(analyze)
  .then(reports => console.log('All done!', reports))
  .catch(err => console.error('Error occurred.', err, err.stack));
