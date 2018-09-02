const path = require('path');

function makeGlobs(root) {
  return [
    path.join(root, '**', '*.jsx'),
    path.join(root, '**', '*.js'),
  ];
}

module.exports = { makeGlobs };
