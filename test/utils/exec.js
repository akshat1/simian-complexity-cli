const assert = require('assert');
const mockery = require('mockery');

describe('utils/exec', function () {
  beforeEach(function () {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true,
    });
  });
  
  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should return a promise', function () {
    const { exec } = require('../../lib/utils/exec');
    assert.ok(exec('ls') instanceof Promise, 'exec(ls) is not a promise');
  });
  
  it('should resolve with stdOut.toString on success', function () {
    const expectedStdOutValue = 'success';
    mockery.registerMock('child_process', {
      exec: function(cmd, options, cb) {
        cb(null, new Buffer(expectedStdOutValue));
      }
    });
    // mockery.enable();

    const { exec } = require('../../lib/utils/exec');
    return exec('FOO').then(str => assert.equal(str, expectedStdOutValue));
  })

  it('should reject with error and stdErr.toString on non empty stdErr', function () {
    const expectedStdErrValue = 'womp womp';
    mockery.registerMock('child_process', {
      exec: function(cmd, options, cb) {
        cb(null, null, new Buffer(expectedStdErrValue));
      }
    });
    // mockery.enable();

    const { exec } = require('../../lib/utils/exec');
    return exec('FOO')
      .then((() => assert.fail('Should not have resolved.')))
      .catch(err => assert.equal(err.stdErr, expectedStdErrValue));
  })

  it('should reject with error and stdErr.toString on error', function () {
    const expectedError = new Error('Tis a failure');
    expectedError.stdErr = undefined;
    mockery.registerMock('child_process', {
      exec: function(cmd, options, cb) {
        cb(expectedError, undefined, undefined);
      }
    });
    // mockery.enable();

    const { exec } = require('../../lib/utils/exec');
    return exec('FOO')
      .then((() => assert.fail('Should not have resolved.')))
      .catch(err => assert.deepEqual(err, expectedError));
  })

  it('should reject with error and stdErr.toString on error', function () {
    const expectedStdErr = 'womp womp';
    const expectedError = new Error('Tis a failure');
    expectedError.stdErr = expectedStdErr;
    mockery.registerMock('child_process', {
      exec: function(cmd, options, cb) {
        cb(expectedError, undefined, expectedStdErr);
      }
    });

    const { exec } = require('../../lib/utils/exec');
    return exec('FOO')
      .then((() => assert.fail('Should not have resolved.')))
      .catch(err => assert.deepEqual(err, expectedError));
  })
});
