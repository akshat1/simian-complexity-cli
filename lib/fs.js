/**
 * Promisified fs functions.
 * @module fs
 */
const fs = require('fs');
const glob = require('glob');
const _ = require('lodash');

/**
 * Promisified fs.readFile.
 *
 * @param {string} filePath - path of the file to read.
 * @returns {Promise<Buffer>} - A Promise that resolves into a buffer, or rejects into an error.
 */
function readFile(filePath) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filePath, function(err, buff) {
      if (err) {
        reject(err);
      } else {
        resolve(buff);
      }
    });
  });
}

/**
 * Promisified fs.writeFile.
 *
 * @see https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback
 * @param {string} filePath - path of the file to write.
 * @param {(string|buffer)} data - the data to be written.
 * @param {(Object|string)} options -
 * @returns {Promise<Buffer>} - A Promise that resolves into nothing, or rejects into an error.
 */
function writeFile(filePath, data, options = {}) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(filePath, data, options, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function mkdir(dirPath) {
  return new Promise(function(resolve, reject) {
    fs.mkdir(dirPath, function(err) {
      if (err && err.code !== 'EEXIST') {
        reject(err);
      } else {
        resolve();
      }
    });
  })
}

/**
 * A promise wrapper around glob.
 * @param {string} pattern - A glob pattern.
 * @returns {Promise<string[]>} - A promise that resolves into an array of file paths.
 */
function _expandSingleGlob(pattern) {
  if (glob) {
    return new Promise(function(resolve, reject) {
      glob(pattern, function(err, files) {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
  }
}

/**
 * Expands an array of glob patterns.
 * @param {string[]} patterns - An array of glob patterns.
 * @returns {Promise<string[]>} - A promise that resolves into an array of file paths.
 */
function expandGlobs(patterns = []) {
  return Promise
    .all(patterns.map(_expandSingleGlob))
    .then(filesArrArr => filesArrArr.filter(_.identity))
    .then(_.flatten);
}

module.exports = {
  expandGlobs,
  readFile,
  writeFile,
  mkdir,
};
