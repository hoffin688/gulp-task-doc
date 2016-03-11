'use strict';

var gulp   = require('.');
var jscs   = require('gulp-jscs');
var jshint = require('gulp-jshint');
var mocha  = require('gulp-mocha');


var jsFiles = ['index.js', 'lib/*.js'];

// @internal
gulp.task('default', ['help']);

/**
 * Display this help
 */
gulp.task('help', gulp.help());

require('./gulp/bump');

// Check code style
gulp.task('jscs', function() {
  return gulp.src(jsFiles)
    .pipe(jscs())
    .pipe(jscs.reporter());
});

// Analise code quality 
gulp.task('jshint', function() {
  return gulp.src(jsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-reporter-jscs'))
    .pipe(jshint.reporter('fail'));
});

// Run tests
gulp.task('test', ['jshint', 'jscs'], function() {
  return gulp.src('test/*.js', { read: false })
    .pipe(mocha({
      reporter: 'spec'
    }));
});