const assert = require('assert');
const mockery = require('mockery');
const sinon = require('sinon');

describe('cli/print-usage-guide', function() {
  let commandLineUsage
  const cmdLnUsageOutput = 'expectedValue';
  let printUsageGuide, sections;

  this.beforeAll(function() {
    mockery.enable({
      warnOnUnregistered: false
    });
    commandLineUsage = sinon.stub().returns(cmdLnUsageOutput);
    mockery.registerMock('command-line-usage', commandLineUsage);

    const pugModule = require('../../lib/cli/print-usage-guide');
    printUsageGuide = pugModule.printUsageGuide;
    sections = pugModule.sections;
  });

  this.afterEach(function() {
    commandLineUsage.resetHistory();
  });

  this.afterAll(function() {
    mockery.disable();
  });

  it('should print usage guide when called without error', function() {
    const consoleLog = sinon.stub(console, 'log');
    printUsageGuide();

    assert.deepEqual(commandLineUsage.args, [[sections]]);
    assert.deepEqual(consoleLog.args, [[cmdLnUsageOutput]]);
    consoleLog.restore();
  });
  it('should print error when called with error object', function() {
    const consoleErr = sinon.stub(console, 'error');
    const errMessage = 'FOO BAR BAZ';
    const testErr = new Error(errMessage);
    const expectedSections = [...sections];
    expectedSections[0] = {
      header: 'Simian Complexity CLI - Error',
      content: testErr.message
    };

    printUsageGuide(testErr);

    assert.deepEqual(commandLineUsage.args, [[expectedSections]]);
    assert.deepEqual(consoleErr.args, [[cmdLnUsageOutput]]);
    consoleErr.restore();
  });

  it('should print error when called with error string', function() {
    const consoleErr = sinon.stub(console, 'error');
    const errMessage = 'FOO BAR BAZ';
    const expectedSections = [...sections];
    expectedSections[0] = {
      header: 'Simian Complexity CLI - Error',
      content: errMessage
    };

    printUsageGuide(errMessage);

    assert.deepEqual(commandLineUsage.args, [[expectedSections]]);
    assert.deepEqual(consoleErr.args, [[cmdLnUsageOutput]]);
    consoleErr.restore();
  });
})
