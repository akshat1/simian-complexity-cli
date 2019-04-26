const commandLineUsage = require('command-line-usage');
const { usageGuideSpec } = require('./command-spec');

const sections = [
  {
    header: 'Simian Complexity CLI',
    content: ['🐒  JavaScript static analysis using typhonjs-escomplex'],
  },
  {
    header: 'Usage',
    content: [
      'simian-complexity -o outDir -s "srcDir"',
      'simian-complexity -o outDir -s "srcDir" -x "/test\.js(x)?/"',
      'simian-complexity -o outDir -s "srcDir" -x "/test\.js(x)?/" -v',
    ],
  },
  {
    header: 'Options',
    optionList: usageGuideSpec,
  }
];

/**
 * Prints a usage-guide.
 * @see https://www.npmjs.com/package/command-line-usage
 * @param {(string|Error)} [errMessage] - Optional. Error object or message.
 */
function printUsageGuide(errMessage) {
  if (errMessage) {
    sections[0] = {
      header: 'Simian Complexity CLI - Error',
      content: errMessage.message || errMessage,
    };
    console.error(commandLineUsage(sections));
  } else {
    console.log(commandLineUsage(sections));
  }
}

module.exports = {
  printUsageGuide,
  sections,
};
