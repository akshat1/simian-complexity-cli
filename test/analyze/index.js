const path = require('path');
const assert = require('assert');
const sinon = require('sinon');
const {
  mockery,
  enableMockery,
  disableMockery
} = require('../mockery');
const { getLogger } = require('../fake-logger');

function makeFakeFS() {
  const mkdir = sinon.stub();
  const writeFile = sinon.stub();

  return {
    mkdir,
    writeFile,
  };
}

describe('analyze', function() {
  this.beforeEach(enableMockery);
  this.afterEach(disableMockery);

  it('should create the target directory for supplied source file path.', async function() {
    const sourceFilePath = '/foo/bar/baz/qux.js';
    const reportFilePath = '/output/foo/bar/baz/qux.js.json';
    const getReportFilePath = sinon.stub().returns(reportFilePath);
    const fs = makeFakeFS();
    fs.mkdir.resolves(0);
    fs.writeFile.resolves(0);
    mockery.registerMock('../utils', { fs, getLogger, getReportFilePath });
    const reportObject = { report: 'object' };
    const analyzeOne = sinon.stub().resolves(reportObject);
    mockery.registerMock('./analyze-one', { analyzeOne })
    const { analyze } = require('../../lib/analyze');
    const result = await analyze([sourceFilePath]);

    assert.deepEqual(fs.mkdir.args, [[path.dirname(reportFilePath)]], 'should have created target directory');
    assert.deepEqual(analyzeOne.args, [[sourceFilePath]], 'should have tried to analyze the source file');
    assert.deepEqual(fs.writeFile.args, [[reportFilePath, JSON.stringify(reportObject, null, 4)]], 'should have written the serialized report to disk');
    assert.deepEqual(result, [reportObject], 'should have resolved with the report');
  });
});