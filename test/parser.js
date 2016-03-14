'use strict';

require('mocha');
require('should');

var fs       = require('fs');
var rewire   = require('rewire');
var parser   = require('../lib/parser');
var TaskInfo = require('../lib/models').TaskInfo;


describe('parser', function() {
  
  describe('makeTaskInfo', function() {
    
    it('should set this filename', function() {
      var task = parser.makeTaskInfo('test', 1);
      task.file.should.endWith('test/parser.js');
      task.line.should.equal(17);
    });

    it('should set lib filename', function() {
      var task = parser.makeTaskInfo('test', 0);
      task.file.should.endWith('lib/parser.js');
      task.line.should.equal(18);
    });
    
  });
  
  it('parseComments should set valid comment', function() {
    var task = new TaskInfo({
      name: 'jscs',
      file: __dirname + '/../gulpfile.js',
      line: 19
    });
    parser.parseComments(task);
  });
  
});