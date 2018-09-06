const sinon = require('sinon');

module.exports = {
  getCli: function (opts = {}) {
    const {
      excludes,
      outputDirectoryPath,
      reportGenerationTime,
      reportName,
      sourceDirectoryPath,
    } = opts;

    return {
      getExcludes: sinon.stub().returns(excludes),
      getOutputDirectoryPath: sinon.stub().returns(outputDirectoryPath),
      getReportName: sinon.stub().returns(reportName),
      getSourceDirectoryPath: sinon.stub().returns(sourceDirectoryPath),
      isHelp: sinon.stub().returns(opts.isHelp),
      isVerbose: sinon.stub().returns(opts.isVerbose),
      printUsageGuide: sinon.stub(),
      reportGenerationTime,
    };
  },
};
