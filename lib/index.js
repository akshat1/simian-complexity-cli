const escomplex = require('escomplex');
const _ = require('lodash');
const path = require('path');
const fs = require('./fs');
const utils = require('./utils');
const { getCommandLineArgs } = require('./get-command-line-args');
const { printUsageGuide } = require('./print-usage-guide');

const escomplexOpts = {};

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
fs.mkdir(cliArgs.out)
  .then(() => fs.expandGlobs(cliArgs.glob))
  .then(filePathsFromGlob => _.uniq(sources.concat(filePathsFromGlob)))
  .then(ensureInputs)
  .then(filePaths => Promise.all(filePaths.map(utils.toSourceObject)))
  .then(sourceObjects => escomplex.analyse(sourceObjects, escomplexOpts))
  .then(report => fs.writeFile(path.join(cliArgs.out, 'escomplex-output.json'), JSON.stringify(report)))
  .then(() => console.log('All done!'))
  .catch(err => console.error('Error occurred.', err));
