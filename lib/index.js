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

if (isHelp()) {
  logger.debug('Print usage guide');
  printUsageGuide();
  logger.debug('Exit');
  process.exit(0);
}

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

(async function main() {
  logger.debug('Starting main…');
  await fs.mkdir(getOutputDirectoryPath());
  logger.debug('Output directory created');
  const globs = makeGlobs(getSourceDirectoryPath());
  logger.debug(`Globs: [${globs.join(', ')}]`);
  const filteredPaths = (await fs.expandGlobs(globs)).filter(shouldFilePathBeKept);
  logger.debug(`${filteredPaths.length} filtered paths`);
  await ensureInputs(filteredPaths);
  logger.debug('Paths ensured.');
  const reports = await analyze(filteredPaths);
  logger.debug('Individual report files generated. Aggregating…');
  const aggregatedReport = await aggregate(reports);
  logger.debug('Reports aggregated. All done.');
  logger.debug('All done!', aggregatedReport);
})();
