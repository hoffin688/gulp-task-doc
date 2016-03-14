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
  this.comment = data.comment || {};
}

TaskInfo.prototype = {
  /**
   * Return the first tag with a name=name
   * @param {string} name
   * @returns {*}
   */
  tag: function tag(name) {
    if (!this.comment || !this.comment.tags) {
      return null;
    }
    
    for (var i = 0; i < this.comment.tags.length; i++) {
      var tagObj = this.comment.tags[i];
      if (tagObj.name === name) {
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
  constructor: TaskList,
  
  push: function push(task) {
    if (!(task instanceof TaskInfo)) {
      if (task.name) {
        return this.push(new TaskInfo(task));
      } else {
        return false;
      }
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
    cb = cb || function(a, b) {
      return a.name.localeCompare(b.name); 
    };
    this.tasks.sort(cb);
    return this;
  },

  /**
   * Return all tasks that have no internal tag and verbose. 
   * If verbose argument is provided than check only or internal tag.
   * @param {boolean} verbose
   * @returns {TaskList}
   */
  filterHidden: function(verbose) {
    return this.filter(function(task) {
      return !task.tag('internal') && (verbose || !task.tag('verbose'));
    });
  },
  
  getLongestNameLength: function getLongestNameLength() {
    var maxLength = 0;
    this.forEach(function(task) {
      maxLength = Math.max(maxLength, task.name.length);
    });
    return maxLength;
  }
};