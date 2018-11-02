const assert = require('assert');
const sinon = require('sinon');
const { promisify } = require('../../src/utils/promisify');

describe('promisify', function() {
  it('should throw an error if not provided a function', function() {
    assert.throws(
      (() => promisify()),
      /first argument must be a function./
    );
  });

  it('when given a function fn, should return another function which returns a promise', function() {
    const testFn = sinon.stub();
    testFn.yieldsAsync(null, 42);
    const promisified = promisify(testFn);
    assert.ok(typeof promisified === 'function', 'promisify(fn) should return a function.');
    const p = promisified();
    assert.ok(typeof p.then === 'function', 'promisify(fn)() should return a Promise.');
  });

  it('promise should resolve with the yielded value', function() {
    const testArgs = ['a', 'b', 'c'];
    const testFn = sinon.stub();
    testFn.yieldsAsync(null, 42);
    const promisified = promisify(testFn);
    const p = promisified(...testArgs);
    return p.then(x => assert.equal(x, 42, 'should have resolved with the yielded value'))
      .then(() => {
        assert.ok(testFn.calledOnce);
        assert.equal(testFn.args[0].length, 4);
        assert.deepEqual(testFn.args[0].slice(0, 3), testArgs);
      });
  });

  it('promise should reject with the error', function() {
    const testArgs = ['a', 'b', 'c'];
    const testFn = sinon.stub();
    const testErr = new Error('FOO');
    testFn.yieldsAsync(testErr);
    const promisified = promisify(testFn);
    const p = promisified(...testArgs);
    return p.catch(err => assert.equal(err, testErr, 'should have rejected with the yielded error'))
      .then(() => {
        assert.ok(testFn.calledOnce);
        assert.equal(testFn.args[0].length, 4);
        assert.deepEqual(testFn.args[0].slice(0, 3), testArgs);
      });
  });
});