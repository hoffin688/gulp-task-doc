'use strict';

module.exports = {
  TaskList: TaskList,
  TaskInfo: TaskInfo
};

function TaskInfo(data) {
  data = data || {};
  this.name    = data.name;
  this.file    = data.file;
  this.line    = data.line;
  this.comment = data.comment;
}

TaskInfo.prototype = {
  tag: function tag(tag) {
    if (!this.comment || !this.comment.tags) {
      return null;
    }
    
    for (var i = 0; i < this.comment.tags.length; i++) {
      var tagObj = this.comment.tags[i];
      if (tagObj.name === tag) {
        return tagObj.value;
      }
    }
    return null;
  }
};

function TaskList(tasks) {
  this.tasks = tasks || [];
}

TaskList.prototype = {
  push: function push(task) {
    if (!(task instanceof TaskInfo)) {
      return;
    }
    
    return this.tasks.push(task);
  },

  forEach: function forEach(cb) {
    for (var i = 0; i < this.tasks.length; i++) {
      if (false === cb(this.tasks[i])) {
        break;
      }
    }
  },
  
  filter: function filter(cb) {
    var tasks = [];
    for (var i = 0; i < this.tasks.length; i++) {
      if (cb(this.tasks[i])) {
        tasks.push(this.tasks[i]);
      }
    }
    return new this.constructor(tasks);
  },

  sort: function sort(cb) {
    return this.tasks.sort(cb);
  },
  
  getLongestNameLength: function getLongestNameLength() {
    var maxLength = 0;
    this.forEach(function(task) {
      maxLength = Math.max(maxLength, task.name.length);
    });
    return maxLength;
  }
};