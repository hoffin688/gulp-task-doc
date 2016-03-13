'use strict';

var fs          = require('fs');
var stackTrace  = require('stack-trace');
var parse       = require('comments-parser');


var files = {};

/**
 * Make a TaskInfo object with proper file, line and name fields
 * @param {string} name
 * @param {number} [calleeOffset=2] How much is call stack since gulp file
 * @returns {TaskInfo|null}
 */
exports.makeTaskInfo = function getTaskInfo(name, calleeOffset) {
  calleeOffset = undefined !== calleeOffset ? calleeOffset : 2;
  var trace = stackTrace.get();
  var gulpFile = trace[calleeOffset];
  if (!gulpFile) {
    return null;
  }
  
  return {
    name: name,
    file: gulpFile.getFileName(),
    line: gulpFile.getLineNumber()
  };
};

exports.parseComments = function parseComments(task, options) {
  if (!files[task.file]) {
    var content = fs.readFileSync(task.file, 'utf-8');
    files[task.file] = parse(content, options);
  }
  
  var comments = files[task.file];
  for (var i = 0; i < comments.length; i++) {
    var comment = comments[i];
    if (comment.end === task.line - 1) {
      task.comment = comment;
    }
  }
};