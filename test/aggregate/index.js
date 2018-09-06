const assert = require('assert');
const sinon = require('sinon');
const {
  disableMockery,
  enableMockery,
  getUtils,
  getCli,
  mockery,
} = require('../mocks');

describe('aggregate/index', function () {
  this.beforeEach(enableMockery);
  this.afterEach(disableMockery);

  it('should return the expected object', async function() {
    const reportGenerationTime = new Date();
    const reportFilePath = 'alpha-beta';
    const commit = '123456';
    const sourceDirectoryPath = 'foo-bar';
    const cli = getCli({ sourceDirectoryPath, reportGenerationTime });
    const utils = getUtils({ commit, reportFilePath });
    const calculatedAggregates = { foo: 'bar' };
    const calculateAggregates = sinon.stub().returns(calculatedAggregates);
    mockery.registerMock('../cli', cli);
    mockery.registerMock('../utils', utils);
    mockery.registerMock('./calculate-aggregates', { calculateAggregates });
    const { aggregate } = require('../../lib/aggregate');
    const expectedReport = {
      calculatedAggregates,
      generatedAt: reportGenerationTime.toISOString(),
      gitCommit: commit,
      sourceDirectory: sourceDirectoryPath,
    };
    await aggregate([]);
    const [[actualReportPath, actualReportString]] = utils.fs.writeFile.args;
    assert.strictEqual(reportFilePath, actualReportPath);
    assert.deepEqual(JSON.parse(actualReportString), expectedReport);
  });
});
