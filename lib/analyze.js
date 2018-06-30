const escomplex = require('typhonjs-escomplex');
const path = require('path');

const {
  fs,
  getLogger,
  getReportFilePath,
} = require('./utils');

const logger = getLogger('analyze');

/**
 * Analyse the specified file and return the analysis report as an object.
 * @param {string} filePath - path of the file to be analysed.
 * @returns {Promise<Object>} - analysis report
 */
async function analyzeOne(filePath) {
  try {
    const source = (await fs.readFile(filePath)).toString();
    const report = await escomplex.analyzeModule(source);
    return {
      filePath,
      report,
      source,
    };
  } catch (err) {
    logger.error(`Error analyzing >${filePath}<`, err)
    throw err;
  }
}

async function analyzeAndWriteToFile(sourceFilePath) {
  logger.debug(`analyzeAndWriteToFile(${sourceFilePath})`);
  try {
    const reportFilePath = await getReportFilePath(sourceFilePath);
    logger.debug(`reportFilePath: ${reportFilePath}`);
    await fs.mkdir(path.dirname(reportFilePath));
    logger.debug('Made directory for report file. Analyze…');
    const reportObject = await analyzeOne(sourceFilePath);
    logger.debug('Analyzed. Got report. Write to file.');
    await fs.writeFile(reportFilePath, JSON.stringify(reportObject, null, 4));
    logger.debug(`Report written to file >${reportFilePath}<.`);
  } catch(err) {
    logger.error(`Error writing report for >${sourceFilePath}<`, err);
  }
}

function analyze(filePaths) {
  return Promise.all(filePaths.map(analyzeAndWriteToFile));
}

module.exports = { analyze };
