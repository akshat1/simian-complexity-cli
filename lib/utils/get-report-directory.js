const path = require('path');
const {
  getOutputDirectoryPath,
  getSourceDirectoryPath,
} = require('../cli');

/**
 * @param {string} filePath - path of a single file.
 * @returns {string} - path of the output json file.
 */
async function getReportFilePath(filePath) {
  const rootPath = getSourceDirectoryPath();

  if (!filePath) throw new Error('[getReportFilePath] Missing source file path.');
  if (filePath.indexOf(rootPath) !== 0)
    throw new Error(`[getReportFilePath] Unexpected filePath >${filePath}< does not start with rootPath >${rootPath}<`);

  const choppedFilePath = filePath.substr(rootPath.length);
  const stub = path.join(
    getOutputDirectoryPath(),
    choppedFilePath
  );
  return `${stub}.json`;
}

module.exports = {
  getReportFilePath,
};
