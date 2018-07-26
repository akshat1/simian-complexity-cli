
/**
 * @module lib/utils
 */

/**
 * Given a function, return another function that returns the value of the supplied function as a
 * Promise.
 *
 * @param {function} fn - the function to be wrapped.
 * @param {*} [optThisArg] - If supplied, will be givn to fn as this arg (you could also just bind fn).
 * @returns {function} - A function that resturns the result of fn as a promise.
 */
function promisify(fn, optThisArg) {
  return function(...args) {
    // return new Promise((resolve, reject) => fn.apply(null, [...args, (err, data) => err ? reject(err) : resolve(data)]));
    return new Promise(function(resolve, reject) {
      fn.apply(optThisArg, [...args, function(err, ...cbArgs) {
        if(err)
          reject(err);
        else
          resolve.apply(null, cbArgs);
      }])
    });
  }
}

module.exports = {
  promisify
}