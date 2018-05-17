// TODO: Create usage-guide example using command-line-usage

const commandLineArgs = require('command-line-args');
const escomplex = require('escomplex');
const glob = require('glob');
const fs = require('fs');

const cliArgs = commandLineArgs([
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'src', type: String, defaultOption: true },
  { name: 'out', alias: 'o', defaultValue: '.simian-complexity-data' }
]);

const globOpts = {};
const escomplexOpts = {};

function handleGlobError(err) {
  console.error('Glob Error:', err);
}

console.log('CLI Args:', cliArgs);
glob(cliArgs.src, globOpts, function (err, filePaths) {
  if (err) {
    return handleGlobError(err);
  }

  const sourceObjects = filePaths.map(function (path) {
    return {
      path,
      code: fs.readFileSync(path).toString()
    };
  });
  console.log(sourceObjects);
  const report = escomplex.analyse(sourceObjects, escomplexOpts);
  console.log(report);
});
