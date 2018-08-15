const _ = require('lodash');
module.exports = {
  cyclomatic        : method => _.get(method, 'cyclomatic', 0),
  halsteadBugs      : method => _.get(method, ['halstead', 'bugs'], 0),
  halsteadDifficulty: method => _.get(method, ['halstead', 'difficulty'], 0),
  halsteadVolume    : method => _.get(method, ['halstead', 'volume'], 0),
  sloc              : method => _.get(method, ['sloc', 'logical'], 0),
};
