const sinon = require('sinon');
const { getFS } = require('./fs');

module.exports = {
  getUtils: function(opts = {}) {
    const { globs, commit } = opts;
    return {
      ensureInputs: sinon.stub().resolves(0),
      fs: getFS(),
      getCommit: sinon.stub().resolves(commit),
      getLogger: require('../mocks').getLogger,
      makeGlobs: sinon.stub().returns(globs),
      shouldFilePathBeKept: sinon.stub(),
      getReportFilePath: sinon.stub().resolves(opts.reportFilePath),
    };
  }
}
