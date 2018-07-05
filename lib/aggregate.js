const path = require('path');
const Report = require('./selectors/report');
const Method = require('./selectors/method');
const {
  getReportName,
  getSourceDirectoryPath,
  reportGenerationTime,
} = require('./cli');
const {
  fs,
  getCommit,
  getLogger,
  getReportFilePath,
} = require('./utils');

const logger = getLogger({ label: 'aggregate' });

/*
TODO: Once we are able to get dependencies from typhonjs-escomplex, we would be able to do weighted
average for these measures instead of simple average. Because simple average doesn't actually
present an accurate picture.

TODO:
  make an object totals { numberOfMethods, halstead: { ... }, sloc }
  make another object average { ... same keys as totals ... }
*/
function calculateAggregates(reports = []) {
  let numberOfMethods = 0;
  let hBugs           = 0;
  let hDifficulty     = 0;
  let hVolume         = 0;
  let cyclomatic      = 0;
  let sloc            = 0;

  reports.forEach(function({ report }) {
    if (!report) {
      return;
    }

    const methods = Report.methods(report);
    numberOfMethods += methods.length;
    methods.forEach(function(method) {
      hBugs       += Method.halsteadBugs(method);
      hDifficulty += Method.halsteadDifficulty(method);
      hVolume     += Method.halsteadVolume(method);
      cyclomatic  += Method.cyclomatic(method);
      sloc        += Method.sloc(method);
    });
  });

  return {
    total: {
      numberOfMethods: numberOfMethods,
      cyclomatic,
      halstead: {
        bugs: hBugs,
        difficulty: hDifficulty,
        volume: hVolume,
      },
      sloc,
    },
    average: {
      cyclomatic: cyclomatic / numberOfMethods,
      halstead: {
        bugs: hBugs / numberOfMethods,
        difficulty: hDifficulty / numberOfMethods,
        volume: hVolume / numberOfMethods,
      },
      sloc: sloc / numberOfMethods,
    },
  };
}

async function aggregate(reports) {
  logger.debug(`Aggregating ${reports.length} reports.`);
  let gitCommit;
  try {
    gitCommit = await getCommit(getSourceDirectoryPath());
    logger.debug(`git commit is ${gitCommit}`);
  } catch(err) {
    logger.error('Error obtaining git hash.', err);
    if (err.type === 'NotARepoError') {
      gitCommit = 'not a git repo';
    } else {
      gitCommit = 'error obtaining git commit hash';
    }
  }

  const aggregatedReport = {
    name: getReportName(),
    generatedAt: (reportGenerationTime).toISOString(),
    gitCommit,
    calculateAggregates: calculateAggregates(reports),
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