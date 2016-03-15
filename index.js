'use strict';

var gulp = require('gulp');

var parser   = require('./lib/parser');
var printer  = require('./lib/printer');
var TaskList = require('./lib/models').TaskList;

module.exports = inheritGulp();

var argv = {
  verbose: -1 !== process.argv.indexOf('-v') ||
           -1 !== process.argv.indexOf('--verbose')
};

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

  return function() {
    list.forEach(function(task) {
      parser.parseComments(task, options.parser);
    });
    console.log(print(list, argv.verbose));
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