const escomplex = require('typhonjs-escomplex');
const path = require('path');

const {
  fs,
  getLogger,
  getReportFilePath,
  passThrough,
} = require('./utils');

const logger = getLogger('analyze');

/**
 * Analyse the specified file and return the analysis report as an object.
 * @param {string} filePath - path of the file to be analysed.
 * @returns {Promise<Object>} - analysis report
 */
function analyzeOne(filePath) {
  return fs
    .readFile(filePath)
    .then(buff => escomplex.analyzeModule(buff.toString()))
    .then(report => ({ report, filePath }))
    .catch(err => logger.error(`Error analyzing >${filePath}<`, err));
}

async function analyzeAndWriteToFile(sourceFilePath) {
  const reportFilePath = await getReportFilePath(sourceFilePath);
  return fs.mkdir(path.dirname(reportFilePath))
    .then(() => analyzeOne(sourceFilePath))
    .then(passThrough(reportObject => fs.writeFile(reportFilePath, JSON.stringify(reportObject, null, 4))))
    .catch(err => logger.error(`Error writing report for >${sourceFilePath}< to >${reportFilePath}<`, err));
}

function analyze(filePaths) {
  return Promise.all(filePaths.map(analyzeAndWriteToFile));
}

module.exports = { analyze };
