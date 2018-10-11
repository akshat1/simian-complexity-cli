const path = require('path');

function withoutExtension(str) {
  return str.replace(/(.jsx?|.ts)?$/, '');
}

const getDependencyPathRelativeToProjectRoot = function (projectRoot, sourceFilePath, dependencyPath) {
  if (dependencyPath.charAt(0) === '.') {
    const sourceFileDirectory = path.dirname(sourceFilePath);
    const res = path.resolve(sourceFileDirectory, dependencyPath);
    return withoutExtension(path.relative(projectRoot, res));
  }

  return withoutExtension(dependencyPath);
};

module.exports = {
  getDependencyPathRelativeToProjectRoot,
  withoutExtension,
};
