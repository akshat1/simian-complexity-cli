const reportSelectors = require('../../src/selectors/report');
const { testSelectors } = require('./test-selectors');
describe('selectors/report', function() {
  testSelectors(
    reportSelectors,
    [{
      name: 'methods',
      expectedPath: 'methods',
      defaultValue: []
    }],
  );
});
