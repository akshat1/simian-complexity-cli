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

function makeMetricsObject() {
  return {
    cyclomatic: 0,
    sloc: 0,
    halstead: {
      bugs: 0,
      difficulty: 0,
      volume: 0,
    }
  };
}

/*
TODO: Once we are able to get dependencies from typhonjs-escomplex, we would be able to do weighted
average for these measures instead of simple average. Because simple average doesn't actually
present an accurate picture.
*/
function calculateAggregates(reports = []) {
  const total = {
    ...makeMetricsObject(),
    numberOfMethods: 0,
  };

  const average = makeMetricsObject();

  // Total various metrics for each report and each method.
  reports.forEach(function({ report }) {
    if (!report) {
      return;
    }

    const methods = Report.methods(report);
    total.numberOfMethods += methods.length;
    methods.forEach(function(method) {
      total.halstead.bugs += Method.halsteadBugs(method);
      total.halstead.difficulty += Method.halsteadDifficulty(method);
      total.halstead.volume += Method.halsteadVolume(method);
      total.cyclomatic += Method.cyclomatic(method);
      total.sloc += Method.sloc(method);
    });
  });

  const numMethods = total.numberOfMethods;
  average.cyclomatic = total.cyclomatic / numMethods
  average.sloc = total.sloc / numMethods;
  average.halstead.bugs = total.halstead.bugs / numMethods;
  average.halstead.difficulty = total.halstead.difficulty / numMethods;
  average.halstead.volume = total.halstead.volume / numMethods;

  return {
    total,
    average,
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
    calculateAggregates: calculateAggregates(reports),
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