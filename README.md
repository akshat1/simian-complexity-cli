# escomplex-cli
A CLI for escomplex.

## Installation
```
$ npm install -g simian-complexity-cli
```

## Usage
```
$ simian-complexity-cli "/Users/foo/git/plato" -x "\/test\/" -x "Gruntfile"
```

This will output JSON files corresponding to each js and jsx files in `/Users/foo/git/plato`, while excluding `/test/`, and `Gruntfile`. The output will be placed in `/Users/foo/git/plato/simian-complexity-data/Git:<git commit hash>`.

Since this is still evolving, command line switches may change. You can always see the latest usage guide by executing
```
$ simian-complexity-cli --help
```
