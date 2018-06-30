const { exec } = require('./exec');

class NotARepoError extends Error {
  constructor(dirPath) {
    super(`The path >${dirPath}< does not point to a git repo.`);
    this.type = 'NotARepoError';
  }
}

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
  getCommit
};
