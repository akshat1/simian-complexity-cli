const assert = require('assert');
const sinon = require('sinon');
const mockery = require('mockery');
const {
  evaluate,
  makeMetricsObject,
  makeAverageObject,
} = require('../../lib/aggregate/model');

describe('aggregate/calculateAggregates', function() {
  const getSourceDirectoryPath = sinon.stub().returns('heckle/jeckle');
  let calculateAggregates;

  this.beforeAll(function() {
    mockery.enable({
      warnOnUnregistered: false
    });
    mockery.registerMock('../cli', { getSourceDirectoryPath });
    calculateAggregates = require('../../lib/aggregate/calculate-aggregates').calculateAggregates;
  });

  it('should not explode when no arguments are provided', function() {
    assert.deepEqual(calculateAggregates(), {
      total: {
        ...evaluate(makeMetricsObject()),
        numberOfMethods: 0,
      },
      average: evaluate(makeAverageObject()),
      weightedAverage: evaluate(makeAverageObject()),
      details: {},
    });
  });

  it('should calculate values', function() {
    const testMethod = {
      cyclomatic: 1,
      sloc: {
        logical: 1
      },
      halstead: {
        bugs: 1,
        difficulty: 1,
        volume: 1,
      },
    };

    const testReport = {
      methods: [
        { ...testMethod },
        { ...testMethod },
        { ...testMethod },
      ],
      dependencies: [],
    };

    const result = calculateAggregates([{ filePath: 'foo/bar/baz.js', report: testReport }]);
    const total = {
      cyclomatic: 3,
      sloc: 3,
      halstead: {
        bugs: 3,
        difficulty: 3,
        volume: 3,
      }
    };
    assert.deepEqual(result, {
      total: {
        ...total,
        numberOfMethods: 3,
      },
      average: total,
      // For a single file, weight is 0 (the default). Which leads to weighted average being 0 as well.
      // This is probably wrong.
      weightedAverage: {
        cyclomatic: 0,
        sloc: 0,
        halstead: {
          bugs: 0,
          difficulty: 0,
          volume: 0,
        },
      },
      details: {
        "../../foo/bar/baz": {
          ...total,
          weight: 0,
          numberOfMethods: 3,
        }
      }
    });
  });
});
