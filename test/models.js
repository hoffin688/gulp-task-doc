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
        comment: undefined
      });
      info.should.be.deepEqual({
        name: 'Test',
        file: 'test.js',
        line: 10,
        comment: undefined
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
    })
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