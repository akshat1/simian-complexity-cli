// const escomplex = require('escomplex');
const _ = require('lodash');
const { fs } = require('./utils');
const path = require('path');
const { analyze } = require('./analyze');
const { aggregate } = require('./aggregate');
const {
  getExcludes,
  getOutputDirectoryPath,
  getSourceDirectoryPath,
  isHelp,
  printUsageGuide,
} = require('./cli');

// const escomplexOpts = {};

if (isHelp()) {
  printUsageGuide();
  process.exit(0);
}

function makeGlobs(root) {
  return [
    path.join(root, '**', '*.jsx'),
    path.join(root, '**', '*.js'),
  ];
}

function ensureInputs(inputs) {
  if (_.isEmpty(inputs)) {
    printUsageGuide(new Error('Missing input'));
    process.exit(1);
  }

  return inputs;
}

function shouldFilePathBeKept(filePath) {
  const patterns = getExcludes() || [];
  for (const excludePattern of patterns) {
    if (new RegExp(excludePattern).test(filePath)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Given an array of file-paths, filters out the ones matching an exclude pattern.
 * @param {string[]} filePaths - an array of file paths.
 * @returns {string[]} - file paths that don't match any exclude pattern.
 */
function rejectExcludes(filePaths) {
  return filePaths.filter(shouldFilePathBeKept);
}

(async function main() {
  await fs.mkdir(getOutputDirectoryPath());
  const globs = makeGlobs(getSourceDirectoryPath());
  const filteredPaths = await fs.expandGlobs(globs).then(rejectExcludes);
  await ensureInputs(filteredPaths);
  const reports = await analyze(filteredPaths);
  // const aggregatedReport = await aggregate(reports);
  console.log('All done!', reports);
})();
