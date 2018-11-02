const { getExcludes } = require('../cli');

function shouldFilePathBeKept(filePath) {
  const patterns = getExcludes() || [];
  for (const excludePattern of patterns) {
    if (new RegExp(excludePattern).test(filePath)) {
      return false;
    }
  }

  return true;
}

module.exports = { shouldFilePathBeKept };
