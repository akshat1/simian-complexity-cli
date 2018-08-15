const assert = require('assert');
const _ = require('lodash');

/**
 * @typedef SelectorTestDescription
 * @property {string} name - name of the selector to be tested.
 * @property {string} expectedPath - what path is the selector expected to select?
 * @property {*} [defaultValue] - if present, this will be expected when the actual value is falsy.
 */

/**
 * Generates and executes unit tests for the given selector module according to the
 * list of testDescriptions.
 * 
 * @param {Object} moduleObject - The selector module to be tested.
 * @param {SelectorTestDescription[]} testDescriptions - Test descriptions.
 */
function testSelectors(moduleObject, testDescriptions) {
  testDescriptions.forEach(function(selectorDescription) {
    const {
      defaultValue,
      expectedPath,
      name,
    } = selectorDescription;
    const expectedVal = 'EXPECTEDVAL';

    describe(name, function() {
      const selector = moduleObject[name];
      it('should get the value at the expected path', function () {
        const testObj = {};
        _.set(testObj, expectedPath, expectedVal);
        assert.equal(selector(testObj), expectedVal);
      });

      if (typeof defaultValue !== 'undefined') {
        it('should return default value if expected path is falsy', function () {
          if (typeof defaultValue === 'object')
            assert.deepEqual(selector({}), defaultValue);
          else
            assert.equal(selector({}), defaultValue);
        });
      }
    })
  });
}

module.exports = { testSelectors };
