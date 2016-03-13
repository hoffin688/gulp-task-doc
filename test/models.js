'use strict';

require('mocha');

var should = require('should');
var models = require('../lib/models');


describe('models', function() {
  
  describe('TaskInfo', function() {
    
    it('constructor should initialize field', function() {
      var info = new models.TaskInfo({
        name: 'Test',
        file: 'test.js',
        line: 10,
        comment: {}
      });
      info.should.be.deepEqual({
        name: 'Test',
        file: 'test.js',
        line: 10,
        comment: {}
      });
    });
    
    it('tag should return first found tag', function() {
      var info = new models.TaskInfo({
        name: 'Test',
        file: 'test.js',
        line: 10,
        comment: {
          tags: [
            { name : 'verbose', value: true     },
            { name : 'group',   value: 'Deploy' }
          ]
        }
      });

      should(info.tag('group')).equal('Deploy');
      should(info.tag('verbose')).equal(true);
    });
    
  });
  
  describe('TaskList', function() {
    
    it('should store items', function() {
      var list = new models.TaskList([
        new models.TaskInfo({ name: 'Item 1'})
      ]);
      
      list.push(new models.TaskInfo({ name: 'Item 2'}));
      
      list.tasks[0].name.should.equal('Item 1');
      list.tasks[1].name.should.equal('Item 2');
    });

    it('should have iterator method', function(next) {
      var list = createSimpleList();
      
      list.forEach(function(task) {
        task.name.should.equal('task1');
        next();
        return false;
      });
    });

    it('should have filter method', function() {
      var list = createSimpleList();

      list = list.filter(function(task) {
        return 'task1' === task.name;
      });

      list.tasks.should.have.length(1);
      list.tasks[0].name.should.equal('task1');
    });

    it('should have sort method', function() {
      var list = createSimpleList();
      list.tasks[0].name = 'task2';
      list.tasks[0].name = 'task1';
      
      list.sort();

      list.tasks[0].name.should.equal('task1');

      list.sort(function(a, b) {
        return -1 * a.name.localeCompare(b.name);
      });

      list.tasks[0].name.should.equal('task2');
    });
    
    it('should filter internal and verbose tasks', function() {
      var list = new models.TaskList([
        new models.TaskInfo({ name: 'task1' }),
        new models.TaskInfo({
          name: 'task2',
          comment: {
            tags: [ { name: 'internal', value: true } ]
          }
        }),
        new models.TaskInfo({
          name: 'task3',
          comment: {
            tags: [ { name: 'verbose', value: true } ]
          }
        })
      ]);
      
      var listDefault = list.filterHidden();
      listDefault.tasks.should.have.length(1);
      listDefault.tasks[0].name.should.equal('task1');

      var listVerbose = list.filterHidden(true);
      listVerbose.tasks.should.have.length(2);
      listVerbose.tasks[0].name.should.equal('task1');
      listVerbose.tasks[1].name.should.equal('task3');
    });
  });
  
  function createSimpleList() {
    return new models.TaskList([
      new models.TaskInfo({
        name: 'task1'
      }),
      new models.TaskInfo({
        name: 'task2'
      })
    ]);
  }
  
});