const assert = require('assert');

describe('makeGlobs', function() {
  it('should make globs', function() {
    const { makeGlobs } = require('../../lib/utils');
    assert.deepEqual(
      makeGlobs('/foo/bar'),
      [
        '/foo/bar/**/*.jsx',
        '/foo/bar/**/*.js'
      ]
    );
  });
});
