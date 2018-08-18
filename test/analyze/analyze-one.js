const assert = require('assert');
const sinon = require('sinon');
const { getLogger } = require('../fake-logger');
const {
  mockery,
  enableMockery,
  disableMockery
} = require('../mockery');

describe('analyze/analyze-one', function() {
  this.beforeEach(enableMockery);
  this.afterEach(disableMockery);

  it('given a filePath it should supply the source to escomplex and return the result', async function() {
    const filePath = 'foo';
    const fileContents = 'bar';
    const esComplexReport = 'baz';
    const readFile = sinon.stub().resolves(fileContents);
    const analyzeModule = sinon.stub().resolves(esComplexReport);
    mockery.registerMock('../utils', {
      getLogger,
      fs: { readFile },
    });
    mockery.registerMock('typhonjs-escomplex', { analyzeModule });
    const { analyzeOne } = require('../../lib/analyze/analyze-one');

    const result = await analyzeOne(filePath);
    assert.deepEqual(result, {
      filePath,
      report: esComplexReport,
      source: fileContents,
    });
    assert.deepEqual(readFile.args, [[filePath]]);
    assert.deepEqual(analyzeModule.args, [[fileContents, { commonjs: true }]]);
  });
});
