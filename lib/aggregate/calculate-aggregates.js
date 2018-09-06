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

function reducer({ total, average }, { report }) {
  if (report) {
    const methods = Report.methods(report);
    total.numberOfMethods += methods.length;
    methods.forEach(function (method) {
      total.halstead.bugs += Method.halsteadBugs(method);
      total.halstead.difficulty += Method.halsteadDifficulty(method);
      total.halstead.volume += Method.halsteadVolume(method);
      total.cyclomatic += Method.cyclomatic(method);
      total.sloc += Method.sloc(method);
    });

    const numMethods = total.numberOfMethods;
    average.cyclomatic = total.cyclomatic / numMethods
    average.sloc = total.sloc / numMethods;
    average.halstead.bugs = total.halstead.bugs / numMethods;
    average.halstead.difficulty = total.halstead.difficulty / numMethods;
    average.halstead.volume = total.halstead.volume / numMethods;
  }

  return {
    total,
    average,
  };
}

/*
TODO: Now that we are getting dependencies, let us use a weighted average instead of simple average to aggregate metrics.
*/
function calculateAggregates(reports = []) {
  const total = {
    ...makeMetricsObject(),
    numberOfMethods: 0,
  };

  const average = makeMetricsObject();

  reports.reduce(reducer, { total, average });
  return { total, average };
}

module.exports = {
  calculateAggregates,
  makeMetricsObject,
  reducer,
};
