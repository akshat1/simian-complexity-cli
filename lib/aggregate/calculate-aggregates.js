const Report = require('../selectors/report');
const Method = require('../selectors/method');

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

function calculateTotals(reports) {
  const total = makeMetricsObject();
  total.numberOfMethods = 0;
  reports.forEach(function({ report }) {
    const methods = Report.methods(report);
    total.numberOfMethods += methods.length;
    methods.forEach(function (method) {
      total.halstead.bugs += Method.halsteadBugs(method);
      total.halstead.difficulty += Method.halsteadDifficulty(method);
      total.halstead.volume += Method.halsteadVolume(method);
      total.cyclomatic += Method.cyclomatic(method);
      total.sloc += Method.sloc(method);
    });
  });

  return total;
}

function calculateAverages(total) {
  const average = makeMetricsObject();
  const numMethods = total.numberOfMethods;
  average.cyclomatic = numMethods ? total.cyclomatic / numMethods : 0
  average.sloc = numMethods ? total.sloc / numMethods : 0;
  average.halstead.bugs = numMethods ? total.halstead.bugs / numMethods : 0;
  average.halstead.difficulty = numMethods ? total.halstead.difficulty / numMethods : 0;
  average.halstead.volume = numMethods ? total.halstead.volume / numMethods : 0;

  return average;
}

function calculateAggregates(reports = []) {
  const total = calculateTotals(reports);
  const average = calculateAverages(total);

  return {
    total,
    average
  };
}

module.exports = {
  calculateAggregates,
  makeMetricsObject,
};
