const sinon = require('sinon');

module.exports = {
  getUtils: function(opts = {}) {
    const { globs } = opts;
    return {
      fs: {
        expandGlobs: sinon.stub(),
        mkdir: sinon.stub(),
      },
      getLogger: require('../mocks').getLogger,
      makeGlobs: sinon.stub().returns(globs),
      shouldFilePathBeKept: sinon.stub(),
      ensureInputs: sinon.stub().resolves(0),
    };
  }
}
