'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var Karma = require('karma').Server;
var server = require( __dirname + '/server.js');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');

gulp.task('start_server', function() {
  server.start();
});

gulp.task('close_server', function() {
  server.close();
});

gulp.task('webdriver_update', $.protractor.webdriver_update);

gulp.task('e2e', function() {
  runSequence('start_server', 'protractor', 'close_server');
});

gulp.task('unit',function() {
  runSequence('jasmine', 'karma');
});

gulp.task('protractor', ['webdriver_update'], function() {
  return gulp.src(['./test/e2e/*Spec.js'])
    .pipe($.protractor.protractor({
      configFile: __dirname + '/protractor.conf.js'
    }))
    .on('error', function(e) {throw e;});
});

gulp.task('karma-build', function(){
  gulp.src(__dirname + '/karma.conf.js')
    .pipe(wiredep({
      fileTypes: {
        js: {
          block: /(([ \t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
          detect: {
            js: /['\']([^'\']+\.js)['\'],?/gi,
            css: /['\']([^'\']+\.js)['\'],?/gi
          },
          replace: {
            js: '"{{filePath}}",',
            css: '"{{filePath}}",'
          }
        }
      }
    }))
    .pipe(gulp.dest(__dirname + '/'));
});

gulp.task('karma', ['karma-build'], function(done) {
  new Karma({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }).start();

  done();
});

gulp.task('jasmine', function() {
  return gulp.src( __dirname + '/test/server/*Spec.js')
             .pipe($.jasmine())
             .on('error', function(e) {throw e;});
});

gulp.task('lint', function() {
  return gulp.src([
    '**/*.js',
    '!./public/components/**',
    '!./node_modules/**'
  ])
  .pipe($.eslint())
  .pipe($.eslint.format())
  .pipe($.eslint.failAfterError());
});

gulp.task('sass', function() {
  gulp.src('./sass/**/*.scss')
    .pipe($.sass().on('error', $.sass.logError))
    .pipe(gulp.dest(__dirname + '/public/css'));
});

gulp.task('sass:watch', function() {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('wiredep', function() {
  return gulp.src(__dirname + '/public/index.html')
    .pipe(wiredep())
    .pipe($.inject(gulp.src([
      __dirname + '/public/*.js',
      __dirname + '/public/controllers/**/*.js',
      __dirname + '/public/services/**/*.js',
      __dirname + '/public/css/**/*.css'
    ]), { relative: true }))
    .pipe(gulp.dest(__dirname + '/public'));
});

