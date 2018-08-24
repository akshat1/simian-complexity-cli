const assert = require('assert');
const {
  disableMockery,
  enableMockery,
  getCli,
  mockery,
} = require('../mocks');

describe('shouldFilePathBeKept', function () {
  this.beforeEach(enableMockery);
  this.afterEach(disableMockery);

  it('should return false for an excluded path and true for others', function() {
    const excludes = [
      'foo',
      '.*bar.*'
    ];
    mockery.registerMock('../cli', getCli({ excludes }));
    const { shouldFilePathBeKept } = require('../../lib/utils');
    assert.equal(shouldFilePathBeKept('baz'), true);
    assert.equal(shouldFilePathBeKept('foo'), false);
    assert.equal(shouldFilePathBeKept('qux'), true);
    assert.equal(shouldFilePathBeKept('dfdgoofbardf'), false);
  });
});