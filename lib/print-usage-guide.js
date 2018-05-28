const commandLineUsage = require('command-line-usage');

/**
 * Prints a usage-guide.
 * @see https://www.npmjs.com/package/command-line-usage
 * @param {(string|Error)} [errMessage] - Optional. Error object or message.
 */
function printUsageGuide(errMessage) {
  const sections = [
    {
      header: 'Simian Complexity CLI',
      content: ['🐒 JavaScript static analysis using typhonjs-escomplex'],
    },
    {
      header: 'Usage',
      content: [
        'simian-complexity -o outDir -g "somedir/**/*.js"',
        'simian-complexity -o outDir -g "somedir/**/*.js" -g "someOtherDir/**/*.jsx"',
        'simian-complexity -o outDir -s "somedir/**/*.js" -s someOtherDir/*.js',
      ],
    },
    {
      header: 'Options',
      optionList: [
        {
          name: 'out',
          alias: 'o',
          description: 'The output directory.',
        },
        {
          name: 'glob',
          alias: 'g',
          description: 'A glob. You can specify multiple values, but each glob must be enclosed in double-quotes.'
        },
        {
          name: 'src',
          alias: 's',
          description: 'Source file(s). You can specify multiple values.'
        },
        {
          name: 'help',
          description: 'Prints this usage guide.',
        },
        {
          name: 'verbose',
          alias: 'v',
          description: 'Pass the verbose flag to escomplex.'
        }
      ]
    }
  ];

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

module.exports = { printUsageGuide };
