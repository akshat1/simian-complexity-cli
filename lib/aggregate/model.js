const { add, weightedAverage } = require('./math');

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

function makeAverageObject() {
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

module.exports = {
  evaluate,
  makeAverageObject,
  makeMetricsObject,
};
