const fs = require('./fs');

function toSourceObject(path) {
  return fs
    .readFile(path)
    .then(function(buff) {
      const code = buff.toString();
      return {
        code,
        path,
      };
    });
}

module.exports = { toSourceObject };
