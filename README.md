# gulp-task-doc
[![Build Status](https://travis-ci.org/megahertz/gulp-task-doc.svg?branch=master)](https://travis-ci.org/megahertz/gulp-task-doc)
[![npm version](https://badge.fury.io/js/gulp-task-doc.svg)](https://badge.fury.io/js/gulp-task-doc)

## Description

Print gulp task list by reading task comments. Output example:

```bash
$ gulp help
[11:25:58] Using gulpfile /www/gulp-task-doc/gulpfile.js
[11:25:58] Starting 'help'...
Usage: gulp [task] [task2] ...

Tasks:
   help     Display this help
   bump     Bump the version
              --type=pre will bump the prerelease version *.*.*-x
              --type=patch or no flag will bump the patch version *.*.x
              --type=minor will bump the minor version *.x.*
              --type=major will bump the major version x.*.*
              --version=1.2.3 will bump to a specific version and ignore other flags
   jscs     Check code style
   jshint   Analise code quality
   test     Run tests
[11:25:59] Finished 'help' after 15 ms

```

## Features
 * Support a separation of gulpfile into multiple files
 * @internal jsdoc-like tag to hide a task from help
 * @verbose jsdoc-like tag to show a task only with a --verbose argument
 * Help output can be customized

## Installation

Install with [npm](https://npmjs.org/package/gulp-task-doc):

`npm install --save-dev gulp-task-doc`

## Usage

```javascript
var gulp   = require('gulp-task-doc'); // Instead of require('gulp');
var jscs   = require('gulp-jscs');

// @internal
gulp.task('default', ['help']);

/**
 * Display this help
 */
gulp.task('help', gulp.help());

/**
 * Check code style
 * @verbose
 */
gulp.task('jscs', function() {
  return gulp.src(jsFiles)
    .pipe(jscs())
    .pipe(jscs.reporter());
});

/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 */
gulp.task('bump', function() {
  return gulp
    .src('package.json')
    .pipe(bump({
      type: args.type,
      version: args.version
    }))
    .pipe(gulp.dest(__dirname));
});

```

## Alternative initialization

If you want to use gulp instead of gulp-task-doc to define tasks you can
use a patchGulp method that uses monkey-patching to override a gulp.task method:

```javascript
var gulp = require('gulp');
var doc  = require('gulp-task-doc').patchGulp();

// Display this help
gulp.task('help', doc.help());
```

## Options

Customize the output by passing a configuration object to the `doc.help()` function.

```javascript
doc.help({
  parser: { // Options for [node-comments-parser](https://github.com/megahertz/node-comments-parser)
    //...
  },
  print: function(tasks, isVerbose) { // Custom print function
    tasks = tasks
      .filterHidden(isVerbose)
      .sort();

    var lines = [
      'gulp [task]\n',
      'Tasks:'
    ];
    tasks.forEach(function(task) {
      lines.push('  ' + task.name);
      task.comment.lines.forEach( (line) => lines.push('    ' + line) );
    });
    return lines.join('\n');
  }
});
```

## License

Licensed under MIT.
