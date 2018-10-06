const path = require('path');
const Report = require('../selectors/report');
const Method = require('../selectors/method');
const cli = require('../cli/');

function add(initialValue = 0) {
  let value = initialValue;
  return function (increment = 0) {
    value += increment;
    return value;
  }
}

function weightedAverage() {
  const denominator = add();
  const numerator = add();
  let average = 0;
  return function(value = 0, weight = 0) {
    if (weight) {
      average = numerator(value * weight) / denominator(weight);
    }
    return average;
  }
}

function makeMetricsObject() {
  return {
    cyclomatic: add(),
    sloc: add(),
    numberOfMethods: add(),
    halstead: {
      bugs: add(),
      difficulty: add(),
      volume: add(),
    }
  };
}

function makeAverage() {
  return {
    cyclomatic: weightedAverage(),
    sloc: weightedAverage(),
    halstead: {
      bugs: weightedAverage(),
      difficulty: weightedAverage(),
      volume: weightedAverage(),
    }
  };
}

function withoutExtension(str) {
  return str.replace(/(.jsx?|.ts)?$/, '');
}

const getAbsoluteDependencyPath = function (projectRoot, sourceFilePath, dependencyPath) {
  if (dependencyPath.charAt(0) === '.') {
    const sourceFileDirectory = path.dirname(sourceFilePath);
    const res = path.resolve(sourceFileDirectory, dependencyPath);
    return withoutExtension(path.relative(projectRoot, res));
  }

  return withoutExtension(dependencyPath);
};

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

function evaluate(obj) {
  if (typeof obj === 'function') {
    return obj();
  }

  if (Array.isArray(obj)) {
    return obj.forEach(evaluate);
  }

  if (typeof obj === 'object') {
    return Object.keys(obj).reduce(
      (acc, key) => ({ ...acc, [key]: evaluate(obj[key]) }),
      {}
    );
  }

  return obj;
}

function calculateAggregates(reports = []) {
  const total = makeMetricsObject();
  const average = makeAverage();
  const weightedAverage = makeAverage();
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
  add,
  calculateAggregates,
  makeMetricsObject,
  weightedAverage,
};
