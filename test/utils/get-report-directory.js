const assert = require('assert');
const mockery = require('mockery');
const { NotARepoError } = require('../../lib/utils/git');

describe('utils/get-report-directory', function() {
  this.beforeAll(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnReplace: true,
      warnOnUnregistered: false,
    });
  });

  this.afterAll(function() {
    mockery.disable();
  });

  this.afterEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
  });

  it('should throw an error if file path is invalid', async function() {
    mockery.registerMock('../cli', {
      getSourceDirectoryPath: () => '/FOO/BAR',
    });

    const { getReportFilePath } = require('../../lib/utils/get-report-directory');
    let rejectedForNoPath, rejectedForInvalidPath;

    try {
      await getReportFilePath();
    } catch(err) {
      /Missing source file path/.test(err.message);
      rejectedForNoPath = true;
    }

    try {
      await getReportFilePath('/BAZ/QUX.js');
    } catch(err) {
      /does not start with rootPath/.test(err.message);
      rejectedForInvalidPath = true;
    }

    assert.ok(rejectedForNoPath);
    assert.ok(rejectedForInvalidPath);
  });

  it('should work correctly when source directory is a git directory', async function () {
    const gitHash = '112358132134';
    const outputDirPath = 'output';
    mockery.registerMock('../cli', {
      getSourceDirectoryPath: () => '/FOO/BAR',
      getOutputDirectoryPath: () => outputDirPath,
    });
    mockery.registerMock('./git', {
      getCommit: () => Promise.resolve(gitHash)
    });

    const { getReportFilePath } = require('../../lib/utils/get-report-directory');
    assert.equal(
      await getReportFilePath('/FOO/BAR/BAZ/QUX.js'),
      `${outputDirPath}/Git:${gitHash}/BAZ/QUX.js.json`,
    );
  });

  it('should work correctly when source directory is not a git directory', async function () {
    const reportGenerationTime = '112358132134';
    const outputDirPath = 'output';
    mockery.registerMock('../cli', {
      getSourceDirectoryPath: () => '/FOO/BAR',
      getOutputDirectoryPath: () => outputDirPath,
      reportGenerationTime,
    });
    mockery.registerMock('./git', {
      getCommit: () => Promise.reject(new NotARepoError('blah')),
      NotARepoError,
    });

    const { getReportFilePath } = require('../../lib/utils/get-report-directory');
    assert.equal(
      await getReportFilePath('/FOO/BAR/BAZ/QUX.js'),
      `${outputDirPath}/Time:${reportGenerationTime}/BAZ/QUX.js.json`,
    );
  })
});