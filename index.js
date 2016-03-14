'use strict';

var gulp = require('gulp');
var argv = require('yargs').alias('v', 'verbose').argv;

var parser   = require('./lib/parser');
var printer  = require('./lib/printer');
var TaskList = require('./lib/models').TaskList;


module.exports = inheritGulp();

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

  var inst = new TaskDoc();

  inst.task = function task(name, dep, fn) {
    this.taskList.push(parser.makeTaskInfo(name));
    return gulp.task.apply(gulp, arguments);
  };

  inst.help = function help(options) {
    options = options || {};
    var list = inst.taskList;
    var print = options.print || printer;

    return function() {
      list.forEach(function(task) {
        parser.parseComments(task, options.parser);
      });
      console.log(print(list, argv.verbose));
    };
  };

  return inst;
}