/**
 * @module lib/utils
 */
const childProcess = require('child_process');

function exec(command, options) {
  return new Promise(function(resolve, reject) {
    childProcess.exec(command, options, function(err, stdOut, stdErr) {
      if (err || (stdErr && stdErr.toString())) {
        reject({
          ...err,
          stdErr: stdErr && stdErr.toString(),
        });
      } else {
        resolve(stdOut && stdOut.toString());
      }
    });
  });
}

module.exports = { exec };