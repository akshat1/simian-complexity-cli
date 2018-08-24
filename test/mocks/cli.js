const sinon = require('sinon');

module.exports = {
  getCli: function (opts = {}) {
    const {
      excludes,
      outputDirectoryPath,
      sourceDirectoryPath,
    } = opts;
    return {
      getExcludes: sinon.stub().returns(excludes),
      getOutputDirectoryPath: sinon.stub().returns(outputDirectoryPath),
      getSourceDirectoryPath: sinon.stub().returns(sourceDirectoryPath),
      isHelp: sinon.stub().returns(opts.isHelp),
      printUsageGuide: sinon.stub(),
      isVerbose: sinon.stub().returns(opts.isVerbose)
    };
  },
};
