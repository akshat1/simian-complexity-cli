const assert = require('assert');
const mockery = require('mockery');
const sinon = require('sinon');
const nodeFS = require('fs');

describe('utils/fs', function() {
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

  it('should promisify these functions', function() {
    const expectedResolution = 'FOO';
    const promisify = sinon.stub().returns(() => Promise.resolve(expectedResolution));
    const glob = require('glob');
    mockery.registerMock('./promisify', { promisify });
    const {
      expandSingleGlob,
      readFile,
      stat,
      writeFile,
    } = require('../../lib/utils/fs');

    assert(typeof readFile === 'function', 'Expected a function exported as readFile');
    assert.ok(promisify.calledWith(nodeFS.readFile));

    assert(typeof stat === 'function', 'Expected a function exported as stat');
    assert.ok(promisify.calledWith(nodeFS.stat));

    assert(typeof writeFile === 'function', 'Expected a function exported as writeFile');
    assert.ok(promisify.calledWith(nodeFS.writeFile));

    assert(typeof expandSingleGlob === 'function', 'Expected a function exported as expandSingleGlob');
    assert.ok(promisify.calledWith(glob));
  });

  describe('expandGlobs', function() {
    it('should return a promise.');
    it('should filter out undefined, and empty arrays.');
    it('should return a flattened array.');
  });

  it('mkdir should call exec with mkdir -p');
});