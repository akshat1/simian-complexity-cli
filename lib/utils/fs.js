/**
 * Promisified fs functions.
 * @module utils/fs
 */
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const _ = require('lodash');
const { promisify } = require('./promisify');
const { getLogger } = require('./logger');

const logger = getLogger({ label: 'fs' });

function mkdir(dirPath) {
  if (!dirPath) {
    const err = new Error('No dirPath');
    logger.error(err);
    process.exit(1);
  }

  const parts = (Array.isArray(dirPath) ? dirPath : dirPath.split(path.sep)).filter(_.identity);
  return new Promise(function(resolve, reject) {
    if (!parts[0]) {
      const err = new Error('No dirPath from ', dirPath);
      logger.error(err);
      reject(err);
    }

    fs.mkdir(parts[0], function(err) {
      if (err && err.code !== 'EEXIST') {
        logger.error(`Error making directory >${parts[0]}<`);
        logger.error(err);
        reject(err);
      } else {
        // logger.debug(`Created directory >${parts[0]}<`);
        resolve();
      }
    });
  }).then(function() {
    if (parts.length > 1) {
      const root = parts.shift();
      parts[0] = path.join(root, parts[0]);
      // logger.debug('Creating subdirectories', parts);
      return mkdir(parts);
    }
  }).catch(err => {
    logger.error(err);
    throw err;
  });
}

/**
 * A promise wrapper around glob.
 * (For some reason, promisify doesn't work with this one)
 *
 * @param {string} pattern - A glob pattern.
 * @returns {Promise<string[]>} - A promise that resolves into an array of file paths.
 */
function expandSingleGlob(pattern) {
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

/**
 * Expands an array of glob patterns.
 * @param {string[]} patterns - An array of glob patterns.
 * @returns {Promise<string[]>} - A promise that resolves into an array of file paths.
 */
function expandGlobs(patterns = []) {
  return Promise
    .all(patterns.map(expandSingleGlob))
    .then(filesArrArr => filesArrArr.filter(arr => arr && arr.length))
    .then(_.flatten)
    .catch(err => {
      logger.error(err);
      throw err;
    });
}

module.exports = {
  expandGlobs,
  mkdir,
  readFile: promisify(fs.readFile),
  stat: promisify(fs.stat),
  writeFile: promisify(fs.writeFile),
};
