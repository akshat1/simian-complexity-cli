// const escomplex = require('escomplex');
const _ = require('lodash');
const {
  fs,
  getLogger,
} = require('./utils');
const path = require('path');
const { analyze } = require('./analyze');
const { aggregate } = require('./aggregate');
const {
  getExcludes,
  getOutputDirectoryPath,
  getSourceDirectoryPath,
  isHelp,
  printUsageGuide,
} = require('./cli');

const logger = getLogger({ label: 'Main' });
let mod;  // eslint-disable-line

function makeGlobs(root) {
  return [
    path.join(root, '**', '*.jsx'),
    path.join(root, '**', '*.js'),
  ];
}

function ensureInputs(inputs) {
  if (_.isEmpty(inputs)) {
    logger.debug('Missing inputs.');
    printUsageGuide(new Error('Missing input'));
    process.exit(1);
  }

  return inputs;
}

function shouldFilePathBeKept(filePath) {
  const patterns = getExcludes() || [];
  for (const excludePattern of patterns) {
    if (new RegExp(excludePattern).test(filePath)) {
      return false;
    }
  }

  return true;
}

async function main() {
  if (isHelp()) {
    logger.debug('Print usage guide');
    printUsageGuide();
    logger.debug('Exit');

    return;
  }

  logger.verbose('Starting…');
  await fs.mkdir(getOutputDirectoryPath());
  logger.debug('Output directory created');
  const globs = mod.makeGlobs(getSourceDirectoryPath());
  logger.verbose(`Globs: [${globs.join(', ')}]`);
  const filteredPaths = (await fs.expandGlobs(globs)).filter(mod.shouldFilePathBeKept);
  logger.verbose(`${filteredPaths.length} filtered paths`);
  await mod.ensureInputs(filteredPaths);
  logger.debug('Paths ensured.');
  const reports = await analyze(filteredPaths);
  logger.verbose('Individual report files generated. Aggregating…');
  const aggregatedReport = await aggregate(reports);
  logger.verbose('Reports aggregated. All done.');
  logger.debug('All done!', aggregatedReport);
}

if (process.env.NODE_ENV !== 'test') {
  main();
}

module.exports = mod = {
  makeGlobs,
  ensureInputs,
  shouldFilePathBeKept,
  main,
};
