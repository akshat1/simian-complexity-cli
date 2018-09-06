const sinon = require('sinon');

module.exports = {
  getFS: function() {
    return {
      writeFile: sinon.stub(),
      expandGlobs: sinon.stub(),
      mkdir: sinon.stub(),
    };
  }
};
