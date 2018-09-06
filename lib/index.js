const {
  ensureInputs,
  fs,
  getLogger,
  makeGlobs,
  shouldFilePathBeKept,
} = require('./utils');
const { analyze } = require('./analyze');
const { aggregate } = require('./aggregate');
const {
  getOutputDirectoryPath,
  getSourceDirectoryPath,
  isHelp,
  printUsageGuide,
} = require('./cli');

const logger = getLogger({ label: 'Main' });

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
  const globs = makeGlobs(getSourceDirectoryPath());
  logger.verbose(`Globs: [${globs.join(', ')}]`);
  const filteredPaths = (await fs.expandGlobs(globs)).filter(shouldFilePathBeKept);
  logger.verbose(`${filteredPaths.length} filtered paths`);
  await ensureInputs(filteredPaths);
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

module.exports = { main };
