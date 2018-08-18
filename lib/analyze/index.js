
const path = require('path');
const {
  fs,
  getLogger,
  getReportFilePath,
} = require('../utils');
const { analyzeOne } = require('./analyze-one');

const logger = getLogger('analyze');

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
    return reportObject;
  } catch(err) {
    logger.error(`Error writing report for >${sourceFilePath}<`, err);
  }
}

function analyze(filePaths) {
  return Promise.all(filePaths.map(analyzeAndWriteToFile));
}

module.exports = { analyze };
