'use strict';

require('mocha');
require('should');

var rewire  = require('rewire');
var printer = require('../lib/printer');
var models  = require('../lib/models');


var formatColumn = rewire('../lib/printer').__get__('formatColumn');


describe('printer', function() {
  
  it('formatColumn should return a string with valid offsets', function() {
    formatColumn('test', 10).should.equal('   test         ');
    formatColumn('1', 1).should.equal('   1   ');
    formatColumn('1', 1, 0, 0).should.equal('1');
  });

  it('should print a list', function() {
    var tasks = new models.TaskList([
      new models.TaskInfo({ 
        name: 'task3',
        comment: {
          lines: ['Task3 description']
        }
      }),
      new models.TaskInfo({
        name: 'task2',
        comment: {
          tags: [ { name: 'internal', value: true } ]
        }
      }),
      new models.TaskInfo({
        name: 'task1',
        comment: {
          lines: [],
          tags: [ { name: 'verbose', value: true } ]
        }
      })
    ]);
    
    printer(tasks).should.equal([
      'Usage: gulp [task] [task2] ...',
      '',
      'Tasks: ',
      '   task3   Task3 description'
    ].join('\n'));

    printer(tasks, true).should.equal([
      'Usage: gulp [task] [task2] ...',
      '',
      'Tasks: ',
      '   task1   ',
      '   task3   Task3 description'
    ].join('\n'));
  });

  it('should print arguments', function() {
    var tasks = new models.TaskList([
      new models.TaskInfo({
        name: 'task',
        comment: {
          lines: [
            'Task description',
            '--arg1 Argument description',
            '--arg2 Argument 2 description'
          ]
        }
      })
    ]);

    printer(tasks).should.equal([
      'Usage: gulp [task] [task2] ...',
      '',
      'Tasks: ',
      '   task   Task description',
      '            --arg1 Argument description',
      '            --arg2 Argument 2 description'
    ].join('\n'));
  });

});