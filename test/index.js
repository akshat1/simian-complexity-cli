const assert = require('assert');
const sinon = require('sinon');
const {
  disableMockery,
  enableMockery,
  mockery,
  getUtils,
  getCli
} = require('./mocks');

describe('index.js', function() {
  describe('--help handling', function() {
    beforeEach(enableMockery);
    afterEach(disableMockery);

    it('should print usage guide when called with the help flag.', function () {
      const utils = getUtils();
      const cli = getCli({ isHelp: true });
      mockery.registerMock('winston', {});
      mockery.registerMock('./cli', cli);
      mockery.registerMock('./utils', utils);
      mockery.registerMock('../utils', utils);

      require('../lib/index').main();
      assert.ok(cli.printUsageGuide.calledOnce);
    });
  });

  describe('main', function() {
    this.beforeAll(enableMockery);
    this.afterAll(disableMockery);

    it('should satisfy all expectations',async  function() {
      // A whole lote of set up
      const outputDirectoryPath = 'foo-bar';
      const sourceDirectoryPath = 'baz-qux';
      const globs = ['a', 'b', 'c', 'd', 'e'];
      const expandedGlobs = ['A', 'B', 'C', 'D', 'E'];
      const filteredPaths = expandedGlobs.slice(0, 3); // we'll set up the filter function to let first three items pass
      const reports = [{a: 0}, {b: 1}, {c: 2}];
      const aggregatedReports = [{d: 0}, {e: 1}, {f: 2}];
      const utils = getUtils({ globs });
      const {
        shouldFilePathBeKept,
        ensureInputs
      } = utils;
      const cli = getCli({
        isHelp: false,
        sourceDirectoryPath,
        outputDirectoryPath,
      });
      const analyze = sinon.stub().resolves(reports);
      const aggregate = sinon.stub().resolves(aggregatedReports);
      mockery.registerMock('./utils', utils);
      mockery.registerMock('./cli', cli);
      mockery.registerMock('./analyze', { analyze });
      mockery.registerMock('./aggregate', { aggregate });
      const mod = require('../lib/index');
      const expandGlobs = utils.fs.expandGlobs;
      expandGlobs.resolves(expandedGlobs);
      shouldFilePathBeKept
        .onFirstCall().returns(true)
        .onSecondCall().returns(true)
        .onThirdCall().returns(true);
      shouldFilePathBeKept.returns(false);

      // The call
      await mod.main();

      // The assertions.
      assert.deepEqual(utils.fs.mkdir.args, [[outputDirectoryPath]], 'should have created output directory');
      assert.deepEqual(ensureInputs.args, [[filteredPaths]], 'should have ensured inputs exist');
      assert.deepEqual(analyze.args, [[filteredPaths]], 'should have analyzed filtered paths');
      assert.deepEqual(aggregate.args, [[reports]], 'should have aggregated reports');
    });
  });

  describe('makeGlobs', function() {
    it('should make globs', function() {
      const { makeGlobs } = require('../lib');
      assert.deepEqual(
        makeGlobs('/foo/bar'),
        [
          '/foo/bar/**/*.jsx',
          '/foo/bar/**/*.js'
        ]
      );
    });
  });

  describe('ensureInputs', function() {
    this.beforeEach(enableMockery);
    this.afterEach(disableMockery);

    it('should return inputs if inputs is non-empty', function() {
      const { ensureInputs } = require('../lib');

      const inputs = ['foo', 'bar', 'baz'];
      assert.deepEqual(ensureInputs(inputs), inputs);
    });

    it('should print usage guide if no inputs are present', function() {
      const printUsageGuide = sinon.stub();
      mockery.registerMock('./cli', { printUsageGuide });
      const { ensureInputs } = require('../lib');
      ensureInputs();
      assert.ok(printUsageGuide.calledOnce);
      assert.ok(printUsageGuide.args[0][0] instanceof Error);
    });

    it('should print usage guide if inputs array is empty', function () {
      const printUsageGuide = sinon.stub();
      mockery.registerMock('./cli', { printUsageGuide });
      const { ensureInputs } = require('../lib');
      ensureInputs([]);
      assert.ok(printUsageGuide.calledOnce);
      assert.ok(printUsageGuide.args[0][0] instanceof Error);
    });
  });

  describe('shouldFilePathBeKept', function () {
    this.beforeEach(enableMockery);
    this.afterEach(disableMockery);

    it('should return false for an excluded path and true for others', function() {
      const getExcludes = sinon.stub().returns([
        'foo',
        '.*bar.*'
      ]);
      mockery.registerMock('./cli', { getExcludes });
      const { shouldFilePathBeKept } = require('../lib');
      assert.equal(shouldFilePathBeKept('baz'), true);
      assert.equal(shouldFilePathBeKept('foo'), false);
      assert.equal(shouldFilePathBeKept('qux'), true);
      assert.equal(shouldFilePathBeKept('dfdgoofbardf'), false);
    });
  });
});
