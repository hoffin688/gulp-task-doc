'use strict';

var gulp     = require('gulp');
var parser   = require('./lib/parser');
var TaskList = require('./lib/models').TaskList;

module.exports = inheritGulp();

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
    var print = options.print || printTasks;

    return function() {
      list.forEach(function(task) {
        parser.parseComments(task, options.parser)
      });
      console.log(print(list));
    }
  };

  return inst;
}

function printTasks(tasks) {
  var results = [
    'Usage: gulp [task] [task2] ...',
    '',
    'Tasks: '
  ];

  var fieldTaskLen = tasks.getLongestNameLength() + 1;


  tasks.forEach(function(task) {
    var lines = task.comment ? task.comment.lines : [];
    results.push(printField(task.name, fieldTaskLen) + (lines[0] || ''));
    for (var i = 1; i < lines.length; i++) {
      results.push(printField('', fieldTaskLen) + '  ' + lines[i]);
    }
  });

  return results.join('\n');
}

function printField(text, len, offsetLeft, offsetRight) {
  offsetLeft  = undefined !== offsetLeft  ? offsetLeft  : 3;
  offsetRight = undefined !== offsetRight ? offsetRight : 3;
  
  return new Array(offsetLeft + 1).join(' ') +
    text +
    new Array(Math.max(len - text.length, 0)).join(' ') +
    new Array(offsetRight + 1).join(' ');
}