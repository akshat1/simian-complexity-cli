const assert = require('assert');
const sinon = require('sinon');
const {
  disableMockery,
  enableMockery,
  mockery,
} = require('./mockery');

const getFakeUtils = function() {
  return {
    fs: {
      expandGlobs: sinon.stub(),
      mkdir: sinon.stub(),
    },
    getLogger: require('./fake-logger').getLogger,
  };
}

describe('index.js', function() {
  describe('--help handling', function() {
    beforeEach(enableMockery);
    afterEach(disableMockery);

    it('should print usage guide when called with the help flag.', function () {
      const utils = getFakeUtils();
      const cli = {
        isHelp: () => true,
        printUsageGuide: sinon.stub(),
      };
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
      const utils = getFakeUtils();
      const cli = {
        isHelp: () => false,
        getSourceDirectoryPath: () => sourceDirectoryPath,
        getOutputDirectoryPath: () => outputDirectoryPath,
      };
      const analyze = sinon.stub().resolves(reports);
      const aggregate = sinon.stub().resolves(aggregatedReports);
      mockery.registerMock('./utils', utils);
      mockery.registerMock('./cli', cli);
      mockery.registerMock('./analyze', { analyze });
      mockery.registerMock('./aggregate', { aggregate });
      const mod = require('../lib/index');
      const makeGlobs = sinon.stub(mod, 'makeGlobs').returns(globs);
      const expandGlobs = utils.fs.expandGlobs;
      expandGlobs.resolves(expandedGlobs);
      const shouldFilePathBeKept = sinon.stub(mod, 'shouldFilePathBeKept');
      shouldFilePathBeKept
        .onFirstCall().returns(true)
        .onSecondCall().returns(true)
        .onThirdCall().returns(true);
      shouldFilePathBeKept.returns(false);
      const ensureInputs = sinon.stub(mod, 'ensureInputs').resolves(0);

      // The call
      await mod.main();

      // The assertions.
      assert.deepEqual(utils.fs.mkdir.args, [[outputDirectoryPath]], 'should have created output directory');
      assert.deepEqual(ensureInputs.args, [[filteredPaths]], 'should have ensured inputs exist');
      assert.deepEqual(analyze.args, [[filteredPaths]], 'should have analyzed filtered paths');
      assert.deepEqual(aggregate.args, [[reports]], 'should have aggregated reports');

      // The teardown. Restore all stubs.
      [makeGlobs, shouldFilePathBeKept, ensureInputs].map(s => s.restore());
    });
  });
});
