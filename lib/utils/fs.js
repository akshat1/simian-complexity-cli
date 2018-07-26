/**
 * Promisified fs functions.
 * @module utils/fs
 */
const fs = require('fs');
const glob = require('glob');
const _ = require('lodash');
const { exec } = require('./exec');
const { promisify } = require('./promisify');
const { getLogger } = require('./logger');

const logger = getLogger({ label: 'fs' });

const mkdir = dirPath => exec(`mkdir -p ${dirPath}`);

/**
 * Promisified `glob()`.
 *
 * @function
 * @param {string} pattern - A glob pattern.
 * @returns {Promise<string[]>} - A promise that resolves into an array of file paths.
 */
const expandSingleGlob = promisify(glob);

/**
 * Expands an array of glob patterns.
 * @param {string[]} patterns - An array of glob patterns.
 * @returns {Promise<string[]>} - A promise that resolves into an array of file paths.
 */
function expandGlobs(patterns = []) {
  return Promise
    .all(patterns.map(pattern => expandSingleGlob(pattern)))
    .then(filesArrArr => filesArrArr.filter(arr => arr && arr.length))
    .then(_.flatten)
    .then(_.uniq)
    .catch(err => {
      logger.error(err);
      throw err;
    });
}

module.exports = {
  expandGlobs,
  expandSingleGlob,
  mkdir,
  readFile: promisify(fs.readFile),
  stat: promisify(fs.stat),
  writeFile: promisify(fs.writeFile),
};
