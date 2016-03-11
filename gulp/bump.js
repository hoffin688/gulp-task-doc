'use strict';

var args = require('yargs');
var gulp = require('..');
var bump = require('gulp-bump');

/**
 * Bump the version
 * --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags
 * @verbose
 */
gulp.task('bump', function() {
  return gulp
    .src(config.packages)
    .pipe($.print())
    .pipe(bump({
      type: args.type,
      version: args.version
    }))
    .pipe(gulp.dest(__dirname + '/..'));
});

