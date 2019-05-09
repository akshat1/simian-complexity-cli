const Report = require('../selectors/report');
const Method = require('../selectors/method');
const {
  evaluate,
  makeAverageObject,
  makeMetricsObject,
} = require('../model/metrics');
const cli = require('../cli');
const path = require('path');
const { withoutExtension } = require('../utils');
const { makeEdge, makeTree, getSubTree, } = require('../model/tree');

/**
 * Given a bunch of reports, returns a map of dependents (as opposed to dependencies). This means
 * each source file S is a node, and each source file directly importing it is a child of S.
 *
 * @param {Report} reports -
 * @returns {Tree} - A tree as described above.
 */
function getDependentsTree(reports) {
  const edges = [];
  reports.forEach(({ id, report }) => {
    edges.push(...report.dependencies.map(d => makeEdge(
      d.path,
      id
    )));
  });

  return makeTree(edges);
}

/**
 * Given a bunch of reports, returns a map of dependencies (as opposed to dependents). This means
 * each source file S is a node, and each source file directly importing it is a *parent* of S.
 *
 * @param {Report} reports -
 * @returns {Tree} - A tree as described above.
 */
function getDependenciesTree(reports) {
  const edges = [];
  reports.forEach(({ id, report }) => {
    edges.push(...report.dependencies.map(d => makeEdge(
      id,
      d.path,
    )));
  });

  return makeTree(edges);
}

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
 * @param {Tree} dependents -
 * @returns {Object<string, number>} - A weights map as described above.
 */
function getWeights(reports, dependents) {
  const weights = {};

  reports.forEach(r => {
    const subTree = getSubTree(r.id, dependents);
    weights[r.id] = subTree.nodes.size - 1;
  });

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

function calculateAggregates(reports = [], dependents) {
  const total = makeMetricsObject();
  const average = makeAverageObject();
  const weightedAverage = makeAverageObject();
  const weights = getWeights(reports, dependents);
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
  calculateAggregates,
  evaluate,
  getDependenciesTree,
  getDependentsTree,
  getReportTotals,
  getWeights,
};
