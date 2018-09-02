const assert = require('assert');
const {
  disableMockery,
  enableMockery,
  getCli,
  getUtils,
  mockery,
} = require('../mocks');

describe('ensureInputs', function() {
  this.beforeEach(enableMockery);
  this.afterEach(disableMockery);

  it('should return inputs if inputs is non-empty', function() {
    mockery.registerMock('./utils', getUtils());
    const { ensureInputs } = require('../../lib/utils');

    const inputs = ['foo', 'bar', 'baz'];
    assert.deepEqual(ensureInputs(inputs), inputs);
  });

  it('should print usage guide if no inputs are present', function() {
    mockery.registerMock('./utils', getUtils());
    const cli = getCli();
    const { printUsageGuide } = cli;
    mockery.registerMock('../cli', cli);
    const foo = require('../../lib/utils');
    const { ensureInputs } = foo;
    ensureInputs();
    assert.ok(printUsageGuide.calledOnce);
    assert.ok(printUsageGuide.args[0][0] instanceof Error);
  });

  it('should print usage guide if inputs array is empty', function () {
    const cli = getCli();
    const { printUsageGuide } = cli;
    mockery.registerMock('../cli', cli);
    const { ensureInputs } = require('../../lib/utils');
    ensureInputs([]);
    assert.ok(printUsageGuide.calledOnce);
    assert.ok(printUsageGuide.args[0][0] instanceof Error);
  });
});
