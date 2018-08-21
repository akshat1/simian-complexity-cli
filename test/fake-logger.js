const sinon = require('sinon');

module.exports = {
  getLogger: function() {
    const stubs = {
      debug: sinon.stub(),
      errorL: sinon.stub(),
      info: sinon.stub(),
      log: sinon.stub(),
      verbose: sinon.stub(),
      warn: sinon.stub(),
    };

    const reset = () => Object.keys(stubs).forEach(s => s.reset());

    return {
      ...stubs,
      reset,
    }
  }
}
