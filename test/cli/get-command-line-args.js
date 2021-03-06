const assert = require('assert');
const sinon = require('sinon');
const {
  disableMockery,
  enableMockery,
  mockery,
} = require('../mocks');

describe('cli/get-command-line-args', function() {
  describe('getCommandLineArgs', function() {
    this.beforeAll(enableMockery);
    this.afterAll(disableMockery);

    it('should maintain cliArgs as a singleton', function() {
      const cliArgs = 42;
      const commandLineArgs = sinon.stub().returns(cliArgs);
      mockery.registerMock('command-line-args', commandLineArgs);
      const { getCommandLineArgs } = require('../../src/cli/get-command-line-args');

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

      const { getReportName } = require('../../src/cli/get-command-line-args');
      assert.equal(await getReportName(), 'fubar');
    });

    it('should use getCommit() when no report name is provided', async function() {
      mockery.registerMock('command-line-args', () => ({}));
      mockery.registerMock('../utils/git', {
        getCommit: () => Promise.resolve('fubar')
      });

      const { getReportName } = require('../../src/cli/get-command-line-args');
      assert.equal(await getReportName(), 'Git:fubar');
    });

    it('should use report generation time when no report name is provided and directory is not a git repo', async function() {
      const toTimeString = sinon.stub(Date.prototype, 'toTimeString');
      toTimeString.returns('fubar');
      mockery.registerMock('command-line-args', () => ({}));
      mockery.registerMock('../utils/git', {
        getCommit: () => Promise.reject('blah')
      });

      const { getReportName } = require('../../src/cli/get-command-line-args');
      assert.equal(await getReportName(), 'fubar');
      toTimeString.restore();
    });
  });

  describe('getExcludes', function() {
    this.beforeEach(enableMockery);
    this.afterEach(disableMockery);

    it('should return the excludes from the command line args', function() {
      mockery.registerMock('command-line-args', () => ({
        exclude: 'fubar',
      }));
      const { getExcludes } = require('../../src/cli/get-command-line-args');
      assert.equal(getExcludes(), 'fubar');
    })
  });

  describe('getOutputDirectoryPath', function () {
    this.beforeEach(enableMockery);
    this.afterEach(disableMockery);

    it('should return the value of the output directory option from the command line', function () {
      mockery.registerMock('command-line-args', () => ({
        out: 'fubar',
      }));
      const { getOutputDirectoryPath } = require('../../src/cli/get-command-line-args');
      assert.equal(getOutputDirectoryPath(), 'fubar');
    })
  });

  describe('isHelp', function () {
    this.beforeEach(enableMockery);
    this.afterEach(disableMockery);

    it('should return whether the --help was supplied on the cli', function () {
      mockery.registerMock('command-line-args', () => ({
        help: 'fubar',
      }));
      const { isHelp } = require('../../src/cli/get-command-line-args');
      assert.equal(isHelp(), 'fubar');
    })
  });
});
