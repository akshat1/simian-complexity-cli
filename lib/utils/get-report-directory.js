const { getCommit, NotARepoError } = require('./git');
const path = require('path');
const {
  getOutputDirectoryPath,
  getSourceDirectoryPath,
  reportGenerationTime,
} = require('../cli');

async function getOutputDirectoryIdentifier() {
  try {
    const commit = await getCommit();
    return `Git:${commit}`;
  } catch (err) {
    if (err instanceof NotARepoError) {
      return `Time:${reportGenerationTime}`;
    }
  }
}

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
  const outputDirectoryId = await getOutputDirectoryIdentifier();
  const stub = path.join(
    getOutputDirectoryPath(),
    outputDirectoryId,
    choppedFilePath
  );
  return `${stub}.json`;
}

module.exports = {
  getOutputDirectoryIdentifier,
  getReportFilePath,
};
