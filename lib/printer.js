'use strict';

module.exports = printTasks;


/**
 * Render output from tasks
 * @param {TaskList} tasks
 * @param {boolean}  [verbose=false]
 * @returns {string}
 */
function printTasks(tasks, verbose) {
  tasks = tasks
    .filterHidden(verbose)
    .sort();

  var results = [
    'Usage: gulp [task] [task2] ...',
    '',
    'Tasks: '
  ];

  var fieldTaskLen = tasks.getLongestNameLength();


  tasks.forEach(function(task) {
    var comment = task.comment || {};
    var lines = comment.lines || [];
    results.push(formatColumn(task.name, fieldTaskLen) + (lines[0] || ''));
    for (var i = 1; i < lines.length; i++) {
      results.push(formatColumn('', fieldTaskLen) + '  ' + lines[i]);
    }
  });

  return results.join('\n');
}

/**
 * Return a text surrounded by space
 * @param {string} text
 * @param {number} width Column width without offsets
 * @param {number} [offsetLeft=3]  space count before text
 * @param {number} [offsetRight=3] space count after text
 * @returns {string}
 */
function formatColumn(text, width, offsetLeft, offsetRight) {
  offsetLeft  = undefined !== offsetLeft  ? offsetLeft  : 3;
  offsetRight = undefined !== offsetRight ? offsetRight : 3;

  return new Array(offsetLeft + 1).join(' ') +
    text +
    new Array(Math.max(width - text.length, 0) + 1).join(' ') +
    new Array(offsetRight + 1).join(' ');
}