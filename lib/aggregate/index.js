const path = require('path');
const {
  getReportName,
  getSourceDirectoryPath,
  reportGenerationTime,
} = require('../cli');
const {
  fs,
  getCommit,
  getLogger,
  getReportFilePath,
} = require('../utils');
const { calculateAggregates } = require('./calculate-aggregates');

const logger = getLogger({ label: 'aggregate' });

async function aggregate(reports) {
  logger.debug(`Aggregating ${reports.length} reports.`);
  let gitCommit;
  try {
    gitCommit = await getCommit(getSourceDirectoryPath());
    logger.debug(`git commit is ${gitCommit}`);
  } catch(err) {
    logger.warn('Error obtaining git hash.', err);
    if (err.type === 'NotARepoError') {
      gitCommit = 'not a git repo';
    } else {
      gitCommit = 'error obtaining git commit hash';
    }
  }

  const aggregatedReport = {
    calculatedAggregates: calculateAggregates(reports),
    generatedAt: (reportGenerationTime).toISOString(),
    gitCommit,
    name: await getReportName(),
    sourceDirectory: getSourceDirectoryPath(),
  };

  logger.debug('Aggregation done. Writing to file.');
  await fs.writeFile(
    await getReportFilePath(path.join(getSourceDirectoryPath(), 'simian-aggregated-report')),
    JSON.stringify(aggregatedReport, null, 2)
  );
  logger.debug('Done writing to file.');
}

module.exports = {
  aggregate
}