# escomplex-cli [![Build Status](https://travis-ci.org/akshat1/simian-complexity-cli.svg?branch=master)](https://travis-ci.org/akshat1/simian-complexity-cli) [![codecov](https://codecov.io/gh/akshat1/simian-complexity-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/akshat1/simian-complexity-cli)
A CLI for escomplex.

## Installation
```
$ npm install -g simian-complexity-cli
```

## Usage
```
$ simian-complexity-cli "/Users/foo/git/plato" -x "\/test\/" -x "Gruntfile"
```

This will output JSON files corresponding to each js and jsx files in `/Users/foo/git/plato`, while excluding `/test/`, and `Gruntfile`. The output will be placed in `/Users/foo/git/plato/simian-complexity-data/` (but you can specify the output location using the --out flag).

We will also place an aggregatation of various complexity metrics (continaing total, average, and weighted average values) into the same directory as `simian-aggregated-report.json`.

Since this is still evolving, command line switches may change. You can always see the latest usage guide by executing
```
$ simian-complexity-cli --help
```

This will produce an output along the lines of
```

Simian Complexity CLI

  🐒  JavaScript static analysis using typhonjs-escomplex  

Usage

  simian-complexity -o outDir -g "somedir/**/*.js"                            
  simian-complexity -o outDir -g "somedir/**/*.js" -g "someOtherDir/**/*.jsx" 
  simian-complexity -o outDir -s "somedir/**/*.js" -s someOtherDir/*.js       

Options

  -o, --out        The output directory.                                                         
  -s, --src        The source directory. This will be scanned recursively for .js, and .jsx      
                   files.                                                                        
  -x, --exclude    Regex pattern to exclude files.                                               
  --help           Prints this usage guide.                                                      
  -v, --verbose    Pass the verbose flag to escomplex.                                           
  -n, --name       Report name.                                                                  
```
