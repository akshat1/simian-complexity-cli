const cli = require('../cli');
const escomplex = require('typhonjs-escomplex');
const path = require('path');
const {
  fs,
  getLogger,
  getDependencyPathRelativeToProjectRoot,
  withoutExtension,
} = require('../utils');
const logger = getLogger('analyze');

// TODO: Should we make report immutable?
const transformReport = (report, filePath) => {
  const transformPath = dependency => ({
    ...dependency,
    path: getDependencyPathRelativeToProjectRoot(cli.getSourceDirectoryPath(), filePath, dependency.path),
  })
  report.dependencies = report.dependencies.map(transformPath);
  return report;
}

/**
 * Analyse the specified file and return the analysis report as an object.
 * @param {string} filePath - path of the file to be analysed.
 * @returns {Promise<Object>} - analysis report
 */
async function analyzeOne(filePath) {
  try {
    const source = (await fs.readFile(filePath)).toString();
    const report = await escomplex.analyzeModule(
      // codesplit(import('foo')) is apparently a syntax error. Curse you babel and TC39 *shakes-fist*
      // i love democracy.
      source.replace(/codesplit\(import\(([^\)]*)\)\)/g, 'require($1)'),  // eslint-disable-line
      { commonjs: true }
    );
    return {
      filePath,
      id: withoutExtension(path.relative(cli.getSourceDirectoryPath(), filePath)),
      report: transformReport(report, filePath),
      source,
    };
  } catch (err)
  /* istanbul ignore next */
  {
    logger.error(`Error analyzing >${filePath}<`, err)
    throw err;
  }
}

module.exports = { analyzeOne };
