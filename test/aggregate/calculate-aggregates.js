const assert = require('assert');
const sinon = require('sinon');
const path = require('path');
const {
  mockery,
  enableMockery,
  disableMockery
} = require('../mocks/mockery');
const { getCli } = require('../mocks/cli');

const {
  evaluate,
  makeMetricsObject,
  makeAverageObject,
} = require('../../lib/aggregate/model');

describe('aggregates/calculate-aggregates', function() {
  describe('calculateAggregates', function() {
    const getSourceDirectoryPath = sinon.stub().returns('heckle/jeckle');
    let calculateAggregates;
  
    this.beforeAll(function() {
      enableMockery();
      mockery.registerMock('../cli', { getSourceDirectoryPath });
      calculateAggregates = require('../../lib/aggregate/calculate-aggregates').calculateAggregates;
    });

    this.afterAll(function() {
      disableMockery();
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

  describe('getWeights', function() {
    const sourceDirectoryPath = 'test-source-directory-path';
    const cli = getCli({ sourceDirectoryPath });
    let getWeights;

    this.beforeAll(function() {
      enableMockery();
      mockery.registerMock('../cli', cli);
      getWeights = require('../../lib/aggregate/calculate-aggregates').getWeights;
    });
    this.afterAll(disableMockery);

    it('should return weights', function() {
      const reports = [{
        filePath: path.join(sourceDirectoryPath, 'src', 'foo'),
        report: { dependencies: []}
      }, {
        filePath: path.join(sourceDirectoryPath, 'src', 'bar'),
        report: { dependencies: [{path: './foo'}]}
      }, {
        filePath: path.join(sourceDirectoryPath, 'src', 'baz'),
        report: { dependencies: [{path: './foo'}, {path: './bar'}]}
      }, {
        filePath: path.join(sourceDirectoryPath, 'src', 'qux'),
        report: {
          dependencies: [
            { path: './foo' },
            { path: './bar' },
            { path: './baz' },
            { path: 'this-absolute-path-should-be-ignored' }
          ]
        }
      }];

      const actualWeights = getWeights(reports);
      const expectedWeights = {
        'src/foo': 3,
        'src/bar': 2,
        'src/baz': 1
      };
      assert.deepEqual(actualWeights, expectedWeights);
    });
  });

  describe('getReportTotals', function() {
    const cli = getCli({ sourceDirectoryPath: 'blah' });
    this.beforeAll(function() {
      enableMockery();
      mockery.registerMock('../cli', cli);
    });
    this.afterAll(disableMockery);

    it('should return totals', function() {
      const { evaluate, getReportTotals } = require('../../lib/aggregate/calculate-aggregates');

      const makeMethod = (cyclomatic, bugs, difficulty, volume, sloc) => ({
        cyclomatic,
        sloc: { logical: sloc },
        halstead: { bugs, difficulty, volume },
      });

      const report = {
        methods: [
          makeMethod(1, 2, 3, 4, 5),
          makeMethod(10, 20, 30, 40, 50),
          makeMethod(100, 200, 300, 400, 500),
        ],
      }

      const actualTotals = evaluate(getReportTotals(report));
      const expectedTotals = {
        numberOfMethods: 3,
        cyclomatic: 111,
        sloc: 555,
        halstead: {
          bugs: 222,
          difficulty: 333,
          volume: 444,
        }
      };
      assert.deepEqual(actualTotals, expectedTotals);
    });
  });
});
