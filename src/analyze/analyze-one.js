const escomplex = require('typhonjs-escomplex');
const {
  fs,
  getLogger
} = require('../utils');

const logger = getLogger('analyze');

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
      report,
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
