/* istanbul ignore next: Nothing to see here. Move along */
(function(){
  // Put this entire file in an IIFE because Istanbul wouldn't ignore it otherwise.
  const { exec } = require('./exec');
  const { getLogger } = require('./logger');
  const { promisify } = require('./promisify');
  const { getCommit } = require('./git');
  const {
    getOutputDirectoryIdentifier,
    getReportFilePath
  } = require('./get-report-directory');
  const fs = require('./fs');

  module.exports = {
    exec,
    fs,
    getCommit,
    getLogger,
    getOutputDirectoryIdentifier,
    getReportFilePath,
    promisify,
  };
})();
