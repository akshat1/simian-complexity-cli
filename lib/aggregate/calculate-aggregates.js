const path = require('path');
const Report = require('../selectors/report');
const Method = require('../selectors/method');
const cli = require('../cli');
const {
  evaluate,
  makeAverageObject,
  makeMetricsObject,
} = require('./model');
const {
  getAbsoluteDependencyPath,
  withoutExtension,
} = require('./utils');

function getWeights(reports) {
  const weights = {};
  for(let { filePath, report } of reports) {
    const { dependencies } = report;
    for (let dependency of dependencies) {
      if (dependency.path.charAt(0) !== '.') {
        continue;
      }
      const dependencyPath = getAbsoluteDependencyPath(cli.getSourceDirectoryPath(), filePath, dependency.path);
      weights[dependencyPath] = (weights[dependencyPath] || 0) + 1;
    }
  }

  return weights;
}

function getReportTotals(report) {
  const total = makeMetricsObject();
  const methods = Report.methods(report);
  total.numberOfMethods(methods.length);
  methods.forEach(function(method) {
    total.cyclomatic(Method.cyclomatic(method));
    total.halstead.bugs(Method.halsteadBugs(method));
    total.halstead.difficulty(Method.halsteadDifficulty(method));
    total.halstead.volume(Method.halsteadVolume(method));
    total.sloc(Method.sloc(method));
  });

  return total;
}

function calculateAggregates(reports = []) {
  const total = makeMetricsObject();
  const average = makeAverageObject();
  const weightedAverage = makeAverageObject();
  const weights = getWeights(reports);
  const details = {};

  reports.forEach(function(report) {
    const reportPath = withoutExtension(path.relative(cli.getSourceDirectoryPath(), report.filePath));
    const weight = weights[reportPath] || 0;
    const reportTotal = getReportTotals(report.report);

    details[reportPath] = {
      weight,
      ...evaluate(reportTotal),
    };

    total.sloc(reportTotal.sloc());
    total.numberOfMethods(reportTotal.numberOfMethods());
    total.cyclomatic(reportTotal.cyclomatic());
    total.halstead.bugs(reportTotal.halstead.bugs());
    total.halstead.difficulty(reportTotal.halstead.difficulty());
    total.halstead.volume(reportTotal.halstead.volume());

    average.sloc(reportTotal.sloc(), 1);
    average.cyclomatic(reportTotal.cyclomatic(), 1);
    average.halstead.bugs(reportTotal.halstead.bugs(), 1);
    average.halstead.difficulty(reportTotal.halstead.difficulty(), 1);
    average.halstead.volume(reportTotal.halstead.volume(), 1);

    weightedAverage.sloc(reportTotal.sloc(), weight);
    weightedAverage.cyclomatic(reportTotal.cyclomatic(), weight);
    weightedAverage.halstead.bugs(reportTotal.halstead.bugs(), weight);
    weightedAverage.halstead.difficulty(reportTotal.halstead.difficulty(), weight);
    weightedAverage.halstead.volume(reportTotal.halstead.volume(), weight);
  });

  return {
    average: evaluate(average),
    total: evaluate(total),
    weightedAverage: evaluate(weightedAverage),
    details,
  };
}

module.exports = {
  getWeights,
  getReportTotals,
  calculateAggregates,
};
