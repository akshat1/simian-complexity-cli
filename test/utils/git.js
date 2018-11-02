const assert = require('assert');
const mockery = require('mockery');
const sinon = require('sinon');

describe('utils/git', function() {
  beforeEach(function () {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true,
    });
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('getCommit()', function() {
    it('should return a cleaned stdOut value', async function() {
      const exec = sinon.stub().resolves('fubar\n');
      mockery.registerMock('./exec', { exec });
      const git = require('../../src/utils/git');
      assert.equal(await git.getCommit(), 'fubar');
    });

    it('should throw NotARepo error when appropriate', function() {
      const exec = sinon.stub().rejects({
        stdErr: 'fatal: Not a git repository (or any of the parent directories): .git\n'
      });
      mockery.registerMock('./exec', { exec });
      const git = require('../../src/utils/git');
      return git.getCommit()
        .catch(function(err) {
          assert.equal(err.type, 'NotARepoError');
        });
    });

    it('should reject with err when exec rejects', function() {
      const exec = sinon.stub().rejects('FUBAR');

      mockery.registerMock('./exec', { exec });
      const git = require('../../src/utils/git');
      return git.getCommit()
        .catch(function(err) {
          assert.equal(err, 'FUBAR');
        });
    });
  });
});