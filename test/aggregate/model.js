const assert = require('assert');
const {
  evaluate,
  makeMetricsObject,
} = require('../../src/aggregate/model');


describe('aggregate/model', function() {
  describe('makeMetricsObject', function() {
    it('should have the expected shape', function() {
      const metricsObject = evaluate(makeMetricsObject());
      const { halstead } = metricsObject;
      assert.strictEqual(metricsObject.cyclomatic, 0);
      assert.strictEqual(metricsObject.sloc, 0);
      assert.strictEqual(halstead.bugs, 0);
      assert.strictEqual(halstead.difficulty, 0);
      assert.strictEqual(halstead.volume, 0);
    });
  });
});
