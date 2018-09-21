const Report = require('../selectors/report');
const Method = require('../selectors/method');

class Totals {
  constructor() {
    this.metrics = makeMetricsObject();
    this.dependencies = {};
    this.dependents = {};
    this.numberOfMethods = 0;
  }

  updateDependencies(dependency, dependent) {
    let dependencies = this.dependencies[dependent];
    if (!dependencies) {
      dependencies = this.dependencies[dependent] = new Set();
    }
    dependencies.add(dependency);

    let dependents = this.dependents[dependency];
    if (!dependents) {
      dependents = this.dependents[dependency] = new Set();
    }
    dependents.add(dependent);
  }

  getDependenciesMap() {
    const dependenciesMap = {};
    for(let dependent in this.dependencies) {
      dependenciesMap[dependent] = Array.from(this.dependencies[dependent]);
    }
    return dependenciesMap;
  }

  getDependentsMap() {
    const dependentsMap = {};
    for (let dependency in this.dependents) {
      dependentsMap[dependency] = Array.from(this.dependents[dependency]);
    }
    return dependentsMap;
  }

  getWeights(dependents) {
    const weights = {};
    for (let dependency in dependents) {
      weights[dependency] = dependents[dependency].length;
    }
    return weights;
  }

  summarize() {
    const dependents = this.getDependentsMap();
    return {
      ...this.metrics,
      dependencies: this.getDependenciesMap(),
      dependents,
      numberOfMethods: this.numberOfMethods,
      weights: this.getWeights(dependents),
    };
  }
}

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

function makeTotalsObject() {
  return new Totals();
}

function calculateTotals(reports) {
  const total = makeTotalsObject();
  total.numberOfMethods = 0;
  reports.forEach(function({ filePath, report }) {
    const methods = Report.methods(report);
    total.numberOfMethods += methods.length;
    methods.forEach(function (method) {
      const { metrics } = total;
      metrics.halstead.bugs += Method.halsteadBugs(method);
      metrics.halstead.difficulty += Method.halsteadDifficulty(method);
      metrics.halstead.volume += Method.halsteadVolume(method);
      metrics.cyclomatic += Method.cyclomatic(method);
      metrics.sloc += Method.sloc(method);
    });

    report.dependencies.forEach(dependencyInfo => {
      const dependency = dependencyInfo.path;
      const dependent = filePath;
      total.updateDependencies(dependency, dependent);
      total.updateDependencies(dependency, dependent);
    });
  });

  return total.summarize();
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
  makeTotalsObject,
};
