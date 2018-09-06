const assert = require('assert');
const {
  calculateAggregates,
  makeMetricsObject,
  reducer,
} = require('../../lib/aggregate/calculate-aggregates');

describe('aggregate', function() {
  describe('makeMetricsObject', function() {
    it('should have the expected shape', function() {
      const metricsObject = makeMetricsObject();
      const { halstead } = metricsObject;
      assert.strictEqual(metricsObject.cyclomatic, 0);
      assert.strictEqual(metricsObject.sloc, 0);
      assert.strictEqual(halstead.bugs, 0);
      assert.strictEqual(halstead.difficulty, 0);
      assert.strictEqual(halstead.volume, 0);
    });
  });

  describe('calculateAggregates', function() {
    it('should not explode when no arguments are provided', function() {
      assert.deepEqual(calculateAggregates(), {
        total: {
          ...makeMetricsObject(),
          numberOfMethods: 0,
        },
        average: makeMetricsObject(),
      });
    });
  });

  describe('reducer', function() {
    it('should not explode when no report is provided', function() {
      assert.deepEqual(reducer({ total: {}, average: {}}, {}), { total: {}, average: {}});
    });

    it('update totals', function() {
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
      };

      const total = { ...makeMetricsObject(), numberOfMethods: 0 };
      const average = makeMetricsObject();
      const result = reducer({ total, average }, { report: testReport });
      assert.deepEqual(result, {
        total: {
          cyclomatic: 3,
          sloc: 3,
          numberOfMethods: 3,
          halstead: {
            bugs: 3,
            difficulty: 3,
            volume: 3,
          }
        },
        average: {
          cyclomatic: 1,
          sloc: 1,
          halstead: {
            bugs: 1,
            difficulty: 1,
            volume: 1,
          },
        },
      });
    })
  });
});