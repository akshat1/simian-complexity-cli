const assert = require('assert');
const mockery = require('mockery');
const sinon = require('sinon');

function disableMockery() {
  mockery.deregisterAll();
  mockery.disable();
}

function enableMockery() {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: true,
    warnOnUnregistered: false,
  });
}

describe('cli/get-command-line-args', function() {
  describe('getCommandLineArgs', function() {
    this.beforeAll(enableMockery);
    this.afterAll(disableMockery);

    it('should maintain cliArgs as a singleton', function() {
      const cliArgs = 42;
      const commandLineArgs = sinon.stub().returns(cliArgs);
      mockery.registerMock('command-line-args', commandLineArgs);
      const { getCommandLineArgs } = require('../../lib/cli/get-command-line-args');

      assert.equal(getCommandLineArgs(), cliArgs);
      assert.equal(getCommandLineArgs(), cliArgs);
      assert.equal(getCommandLineArgs(), cliArgs);

      assert.ok(commandLineArgs.calledOnce, 'commandLineArgs() should only have been called once.');
    });
  });

  describe('getReportName', function() {
    this.beforeEach(enableMockery);
    this.afterEach(disableMockery);

    it('should return name when provided on the cli', async function() {
      mockery.registerMock('command-line-args', () => ({
        name: 'fubar',
      }));

      const { getReportName } = require('../../lib/cli/get-command-line-args');
      assert.equal(await getReportName(), 'fubar');
    });

    it('should use getCommit() when no report name is provided', async function() {
      mockery.registerMock('command-line-args', () => ({}));
      mockery.registerMock('../utils/git', {
        getCommit: () => Promise.resolve('fubar')
      });

      const { getReportName } = require('../../lib/cli/get-command-line-args');
      assert.equal(await getReportName(), 'Git:fubar');
    });

    it('should use report generation time when no report name is provided and directory is not a git repo', async function() {
      const toTimeString = sinon.stub(Date.prototype, 'toTimeString');
      toTimeString.returns('fubar');
      mockery.registerMock('command-line-args', () => ({}));
      mockery.registerMock('../utils/git', {
        getCommit: () => Promise.reject('blah')
      });

      const { getReportName } = require('../../lib/cli/get-command-line-args');
      assert.equal(await getReportName(), 'fubar');
      toTimeString.restore();
    });
  });
});
