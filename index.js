'use strict';

var gulp = require('gulp');

var parser   = require('./lib/parser');
var printer  = require('./lib/printer');
var TaskList = require('./lib/models').TaskList;


var argv = {
  verbose: -1 !== process.argv.indexOf('-v') ||
           -1 !== process.argv.indexOf('--verbose')
};

module.exports = inheritGulp();

/**
 * Emits files matching provided glob or an array of globs.
 * @param {string|Array} glob
 * @param {Object}       [options]
 * @returns {Stream}
 * @name module.exports.src
 */

/**
 * Can be piped to and it will write files.
 * @param {string|Function} path
 * @param {Object}          [options]
 * @name module.exports.dest
 */

/**
 * Define a task
 * @param {string}   name  The name of the task.
 * @param {Array}    [dep] Task dependencies
 * @param {Function} [fn]  The function that performs the task's operations
 * @return {Stream|Promise}
 */
module.exports.task = function task(name, dep, fn) {
  this.taskList.push(parser.makeTaskInfo(name));
  return gulp.task.apply(gulp, arguments);
};

/**
 * Watch files and do something when a file changes.
 * @param {string|Array}   glob
 * @param {Object}         [opt]
 * @param {Array|Function} [fn]
 * @return {EventEmitter}
 * @name module.exports.watch
 */
module.exports.watch = function watch(glob, opt, fn) {
  return gulp.watch.apply(gulp, arguments);
};

/**
 * Factory that creates gulp task function
 * @param {Object}   [options]
 * @param {Object}   options.parser
 * @param {Function} options.print
 * @returns {Function}
 */
module.exports.help = function help(options) {
  options = options || {};
  var list = module.exports.taskList;
  var print = options.print || printer;

  return function(done) {
    list.forEach(function(task) {
      parser.parseComments(task, options.parser);
    });
    console.log(print(list, argv.verbose));
    done();
  };
};

/**
 * Alternative way of the library usage, apply monkey-patching to gulp.task
 * @param {Gulp} [gulpInst]
 */
module.exports.patchGulp = function patchGulp(gulpInst) {
  gulpInst = gulpInst || gulp;

  var originalTasks = gulpInst.task;
  gulpInst.task = function task(name, dep, fn) {
    module.exports.taskList.push(parser.makeTaskInfo(name));
    return originalTasks.apply(gulpInst, arguments);
  };

  return this;
};

/**
 * Return a new instance that is inherited from Gulp
 * @returns {TaskDoc}
 */
function inheritGulp() {
  function TaskDoc() {
    this.taskList = new TaskList();
    gulp.Gulp.call(this);
  }
  TaskDoc.prototype = gulp;
  return new TaskDoc();
}