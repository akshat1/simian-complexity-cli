const sinon = require('sinon');

module.exports = {
  getLogger: function() {
    const debug = sinon.stub();
    const error = sinon.stub();
    const info = sinon.stub();
    const log = sinon.stub();
    const warn = sinon.stub();

    const stubs = [
      debug,
      warn,
      error,
      info,
      log,
    ];

    const reset = () => stubs.forEach(s => s.reset());

    return {
      debug,
      error,
      info,
      log,
      reset,
      warn,
    }
  }
}
