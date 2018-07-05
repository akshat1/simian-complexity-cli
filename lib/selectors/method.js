module.exports = {
  cyclomatic        : method => method.cyclomatic || 0,
  halsteadBugs      : method => method.halstead.bugs || 0,
  halsteadDifficulty: method => method.halstead.difficulty || 0,
  halsteadVolume    : method => method.halstead.volume || 0,
  sloc              : method => method.sloc.logical || 0,
};
