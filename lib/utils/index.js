const { exec } = require('./exec');
const { getLogger } = require('./logger');
const { promisify } = require('./promisify');
const fs = require('./fs');

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

module.exports = {
  getLogger,
  fs,
  promisify,
  passThrough,
  exec,
};
