const path = require('path');
const { exec } = require('./exec');
const { getLogger } = require('./logger');
const { promisify } = require('./promisify');
const { getCommit } = require('./git');
const fs = require('./fs');
const {
  getOutputDirectoryPath,
  getReportName,
  getSourceDirectoryPath,
} = require('../cli');

/**
 * Given fn, returns a new function fnA such that,
 * fnA(a) {
 *   fn(a);
 *   return a;
 * }
 * 
 * Useful for promise handling.
 *
 * @param {function} fn - a function.
 * @returns {function} - another function as described in the description.
 */
function passThrough(fn) {
  return function(x) {
    fn(x);
    return x;
  }
}

/**
 * @param {string} filePath - path of a single file.
 * @returns {string} - path of the output json file.
 */
function getReportFilePath(filePath) {
  const rootPath = getSourceDirectoryPath();

  if (filePath.indexOf(rootPath) !== 0) {
    throw new Error(`[getReportFilePath] Unexpected filePath >${filePath}< does not start with rootPath >${rootPath}<`);
  }

  const choppedFilePath = filePath.substr(rootPath.length);
  const stub = path.join(
    getOutputDirectoryPath(),
    getReportName(),
    choppedFilePath
  );
  return `${stub}.json`;
}

module.exports = {
  exec,
  fs,
  getCommit,
  getLogger,
  passThrough,
  promisify,
  getReportFilePath,
};
