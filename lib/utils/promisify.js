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