'use strict';

require('mocha');
require('should');

var gulp = require('gulp');


describe('gulpPatch', function() {

  var cache = require.cache[require.resolve('../index')];
  
  before(function() {
    delete require.cache[require.resolve('../index')];
  });

  after(function() {
    require.cache[require.resolve('../index')] = cache;
  });
  
  
  it('should override gulp.task method', function() {
    var gulpTaskDoc = require('../index');

    gulpTaskDoc = gulpTaskDoc.patchGulp();
    gulp.task('task-patch', function(){});

    gulpTaskDoc.taskList.tasks.should.have.length(1);
    gulp.tasks.should.have.property('task-patch');

    var tasks = gulpTaskDoc.taskList.tasks;
    tasks[0].should.containEql({
      name: 'task-patch',
      file: __filename
    });
  });
  
});