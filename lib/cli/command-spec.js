const baseSpec = [
  {
    alias: 'o',
    defaultValue: 'simian-complexity-data',
    description: 'The output directory',
    name: 'out',
  },
  {
    alias: 'g',
    description: 'A glob. You can specify multiple values, but each glob must be enclosed in double-quotes.',
    multiple: true,
    name: 'glob',
  },
  {
    alias: 's',
    description: 'Source file(s). You can specify multiple values.',
    multiple: true,
    name: 'src',
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
