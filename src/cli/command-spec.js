const baseSpec = [
  {
    alias: 'o',
    defaultValue: 'simian-complexity-data',
    description: 'The output directory.',
    name: 'out',
  },
  {
    alias: 's',
    defaultOption: true,
    description: 'The source directory. This will be scanned recursively for .js, and .jsx files.',
    name: 'src',
    type: String,
  },
  {
    alias: 'x',
    defaultValue: [],
    description: 'Regex pattern to exclude files.',
    multiple: true,
    name: 'exclude',
    type: String,
  },
  {
    description: 'Prints this usage guide.',
    name: 'help',
    type: Boolean,
  },
  {
    alias: 'v',
    description: 'Pass the verbose flag to escomplex.',
    name: 'verbose',
    type: Boolean,
  },
  {
    alias: 'n',
    description: 'Report name.',
    name: 'name',
    type: String,
  }
];

const commandSpec = baseSpec.map(function ({ name, alias, type, multiple, defaultOption, defaultValue }) {
  return {
    alias,
    defaultOption,
    defaultValue,
    multiple,
    name,
    type
  };
});

const usageGuideSpec = baseSpec.map(function ({ name, alias, description }) {
  return {
    alias,
    description,
    name
  };
});

module.exports = {
  baseSpec,
  commandSpec,
  usageGuideSpec
};
