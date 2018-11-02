const assert = require('assert');
const mockery = require('mockery');
const sinon = require('sinon');
const nodeFS = require('fs');
const _ = require('lodash');

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
    } = require('../../src/utils/fs');

    assert(typeof readFile === 'function', 'Expected a function exported as readFile');
    assert.ok(promisify.calledWith(nodeFS.readFile));

    assert(typeof stat === 'function', 'Expected a function exported as stat');
    assert.ok(promisify.calledWith(nodeFS.stat));

    assert(typeof writeFile === 'function', 'Expected a function exported as writeFile');
    assert.ok(promisify.calledWith(nodeFS.writeFile));

    assert(typeof expandSingleGlob === 'function', 'Expected a function exported as expandSingleGlob');
    assert.ok(promisify.calledWith(glob));
  });

  it('expandGlobs should pass tests', async function() {
    const globResult = [
      ['a', 'b', 'c'],
      ['b', 'd', 'e'],
      [],
      undefined,
      ['z'],
    ];
    // Mock promisify as a way to mock expandSingleGlob. The following line is purely constructed
    // to help test, has no bearing on how things actually work (expect that promisify returns a
    // function which in turn returns a promise). We want to test whether expandGlobs filters out
    // empty arrays and undefineds. Thus the weird resolution value.
    const promisify = sinon.stub().returns(expectedVal => Promise.resolve(Array.from(expectedVal || [expectedVal])));
    mockery.registerMock('./promisify', { promisify });
    const fs = require('../../src/utils/fs');

    assert.deepEqual(await fs.expandGlobs(), [], 'Should have a default patterns value of []');
    assert.ok(fs.expandGlobs([]) instanceof Promise, 'Expected a promise from expandGlobs()');
    assert.deepEqual(await fs.expandGlobs(globResult), _.uniq(_.flatten(globResult)), 'Should have flattened, filtered, and deduped result.');
  });

  it('mkdir should call exec with mkdir -p', async function() {
    const testDirectoryPath = 'foo/bar/baz';
    const exec = sinon.stub().resolves(42);
    mockery.registerMock('./exec', { exec });
    const fs = require('../../src/utils/fs');
    await fs.mkdir(testDirectoryPath);
    exec.calledWith(`mkdir -p ${testDirectoryPath}`, 'Should have exececuted mkdir -p <dir path>');
  });
});
