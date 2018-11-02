/**
 * @module lib/utils
 */
const { exec } = require('./exec');

/**
 * A simple custom error to be used when the target directory is not a git repo.
 */
class NotARepoError extends Error {
  constructor(dirPath) {
    super(`The path >${dirPath}< does not point to a git repo.`);
    this.type = 'NotARepoError';
  }
}

/**
 * Get SHA of the most recent commit. This function needs the git executable to be installed
 * and on the path.
 *
 * @param {string} dirPath - path of the target directory.
 * @returns {Promise<string>} - SHA of the most recent commit.
 */
function getCommit(dirPath) {
  return exec('git rev-parse --verify HEAD', { cwd: dirPath })
    // Remove trailing newline
    .then(strCommit => strCommit.replace(/\n$/, ''))
    .catch(function(err) {
      if ((err.stdErr || '').indexOf('fatal: Not a git repository (or any of the parent directories): .git\n') === 0) {
        throw new NotARepoError(dirPath);
      }

      throw err;
    });
}

module.exports = {
  getCommit,
  NotARepoError
};
