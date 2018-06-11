const escomplex = require('typhonjs-escomplex');
const path = require('path');
const fs = require('./fs');
const { getCommandLineArgs } = require('./cli');
const {
  errorLogger,
  logger,
  passThrough,
} = require('./utils');

function getReportFilePath(filePath) {
  return `${path.join(getCommandLineArgs().out, filePath)}.json`;
}

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
    .catch(errorLogger('Error analyzing ', filePath));
}

function analyzeAndWriteToFile(sourceFilePath) {
  const reportFilePath = getReportFilePath(sourceFilePath);
  return fs.mkdir(path.dirname(reportFilePath))
    .then(() => analyzeOne(sourceFilePath))
    .then(passThrough(reportObject => fs.writeFile(reportFilePath, JSON.stringify(reportObject, null, 4))))
    .catch(errorLogger('Error writing report for ', sourceFilePath, 'to', reportFilePath));
}

function aggregate(reports) {
  return { reports };
}

function analyze(filePaths) {
  return Promise
    .all(filePaths.map(analyzeAndWriteToFile))
    .then(logger('Analyzed', filePaths.length, 'files. Now aggregating reports…'))
    .then(aggregate)
    .then(logger('Reports aggregated.'))
    .catch(errorLogger('Error analyzing filePaths'));
}

module.exports = { analyze };
