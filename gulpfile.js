'use strict';

var gulp = require('gulp');
var Karma = require('karma').Server;
var jasmine = require('gulp-jasmine');
var protractor = require('gulp-protractor').protractor;
var webdriver_update = require('gulp-protractor').webdriver_update;
var server = require( __dirname + '/server.js');
var eslint = require('gulp-eslint');

gulp.task('start_server', function() {
  server.start();
});

gulp.task('close_server', function() {
  server.close();
});

gulp.task('webdriver_update', webdriver_update);

gulp.task('protractor', ['webdriver_update'], function() {
  return gulp.src(['./test/e2e/*Spec.js'])
    .pipe(protractor({
      configFile: __dirname + '/protractor.conf.js'
    }))
    .on('error', function(e) {throw e;});
});

gulp.task('karma', function(done) {
  new Karma({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('jasmine', function() {
  return gulp.src( __dirname + '/test/server/*Spec.js')
             .pipe(jasmine())
             .on('error', function(e) {throw e;});
});

gulp.task('lint', function() {
  return gulp.src([
    '**/*.js',
    '!./public/components/**',
    '!./node_modules/**'
  ])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});
