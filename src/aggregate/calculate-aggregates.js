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
  getDependencyPathRelativeToProjectRoot,
  withoutExtension,
} = require('./utils');

/**
 * Given a list of report objects (each containing a list of dependencies), returns an object
 * mapping each source files to its _weight_, where weight is simply the number of files dependent
 * on it. So for instance, a file that is `require()` (or imported) by 3 files will have a weight
 * 3 (and the reports param will have at least 4 report objects with three requiring the report
 * with the weight 3).
 *
 * This function only calculates weights for relative paths (as imports with absolute paths are
 * usually in node_modules and we don't analyse them).
 *
 * *Note* Source file paths, the key in the returned map, is relative to the project root. 
 *
 * @param {Object[]} reports - A list of report objects.
 * @returns {Object<string, number>} - A weights map as described above.
 */
function getWeights(reports) {
  const weights = {};
  for(let { filePath, report } of reports) {
    const { dependencies } = report;
    for (let dependency of dependencies) {
      if (dependency.path.charAt(0) !== '.') {
        continue;
      }
      const dependencyPath = getDependencyPathRelativeToProjectRoot(cli.getSourceDirectoryPath(), filePath, dependency.path);
      weights[dependencyPath] = (weights[dependencyPath] || 0) + 1;
    }
  }

  return weights;
}

/**
 * Calculates the total values of various metrics for the given report (instead of "method
 * aggregate" or average as contained within the report object) by summing them for each
 * method.
 *
 * @param {Object} report - Report
 * @returns {Object} - An object containing totals of various metrics we care about.
 */
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
  evaluate,
  getWeights,
  getReportTotals,
  calculateAggregates,
};
