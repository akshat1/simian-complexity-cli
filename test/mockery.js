const mockery = require('mockery');

function disableMockery() {
  mockery.deregisterAll();
  mockery.disable();
}

function enableMockery() {
  mockery.enable({
    useCleanCache: true,
    warnOnReplace: true,
    warnOnUnregistered: false,
  });
}

module.exports = {
  mockery,
  enableMockery,
  disableMockery,
};
