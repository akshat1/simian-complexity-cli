/* istanbul ignore next: Nothing to see here. Move along */
(function(){
  // Put this entire file in an IIFE because Istanbul wouldn't ignore it otherwise.
  const { ensureInputs } = require('./ensure-inputs');
  const { exec } = require('./exec');
  const { getCommit } = require('./git');
  const { getLogger } = require('./logger');
  const { makeGlobs } = require('./make-globs');
  const { promisify } = require('./promisify');
  const { shouldFilePathBeKept } = require('./should-file-path-be-kept');
  const {
    getOutputDirectoryIdentifier,
    getReportFilePath
  } = require('./get-report-directory');
  const fs = require('./fs');

  module.exports = {
    ensureInputs,
    exec,
    fs,
    getCommit,
    getLogger,
    getOutputDirectoryIdentifier,
    getReportFilePath,
    makeGlobs,
    promisify,
    shouldFilePathBeKept,
  };
})();
