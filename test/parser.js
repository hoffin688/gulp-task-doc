'use strict';

require('mocha');
require('should');

var parser   = require('../lib/parser');


describe('parser', function() {
  
  describe('makeTaskInfo', function() {
    
    it('should set this filename', function() {
      var task = parser.makeTaskInfo('test', 1);
      task.file.should.endWith('test/parser.js');
      task.line.should.equal(14);
    });

    it('should set lib filename', function() {
      var task = parser.makeTaskInfo('test', 0);
      task.file.should.endWith('lib/parser.js');
      task.line.should.equal(18);
    });
    
  });
  
  it('parseComments should set valid comment', function() {
    var task = {
      name: 'jscs',
      file: __dirname + '/../gulpfile.js',
      line: 19
    };
    parser.parseComments(task);
  });
  
});