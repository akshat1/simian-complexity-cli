const isLoggingEnabled = true; // this may be controlled in the future by the verbose flag.

/**
 * Given fn, returns a new function fnA such that,
 * fnA(a) {
 *   fn(a);
 *   return a;
 * }
 * 
 * Useful for promise handling.
 *
 * @param {function} fn - a function.
 * @returns {function} - another function as described in the description.
 */
function passThrough(fn) {
  return function(x) {
    fn(x);
    return x;
  }
}


/**
 * Returns a function that will accept an error object, log it to console.error
 * along with pre-supplied messages, and then throw the error.
 * 
 * This is useful when dealing with promises.
 *
 * @param {...*} varArgs - optional parameters to be passed to console.error.
 * @returns {function} - a function that accepts an error and throws it.
 */
function errorLogger() {
  const args = Array.from(arguments);
  return function(err) {
    console.error.apply(console, args.concat([err]));  // eslint-disable-line no-console
    return err;
  }
}

/**
 * To log promise steps. Returns a function that will print the desired message, along with the
 * promise resolution (optionally).
 *
 * @param {...*} varArgs - any messages; optionally, the last param can be an object of the form
 *   { isLoggerConfig: true, shouldPrintArgument: (true|false) }.
 * @returns {function} - A function.
 */
function logger() {
  const args = Array.from(arguments);
  let loggerConfig;
  // Handle the situation where we want to specify logger configuration as the last argument
  if (args.length && args[args.length - 1].isLoggerConfig) {
    loggerConfig = args.pop();
  } else {
    loggerConfig = {};
  }

  const shouldPrintArgument = loggerConfig.shouldPrintArgument;

  return function(arg) {
    if (isLoggingEnabled) {
      const consoleArgs = shouldPrintArgument ? args.concat[arg] : args;
      console.log.apply(console, consoleArgs);  // eslint-disable-line no-console
    }
    return arg;
  }
}

module.exports = {
  errorLogger,
  logger,
  passThrough,
};
