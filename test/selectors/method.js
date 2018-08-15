const methodSelectors = require('../../lib/selectors/method');
const { testSelectors } = require('./test-selectors');
describe('selectors/method', function() {
  testSelectors(
    methodSelectors,
    [{
      name: 'cyclomatic',
      expectedPath: 'cyclomatic',
      defaultValue: 0
    }, {
      name: 'halsteadBugs',
      expectedPath: 'halstead.bugs',
      defaultValue: 0
    }, {
      name: 'halsteadDifficulty',
      expectedPath: 'halstead.difficulty',
      defaultValue: 0
    }, {
      name: 'halsteadVolume',
      expectedPath: 'halstead.volume',
      defaultValue: 0
    }, {
      name: 'sloc',
      expectedPath: 'sloc.logical',
      defaultValue: 0
    }],
  );
});
