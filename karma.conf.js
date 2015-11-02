'use strict';

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'public/components/angular/angular.min.js',
      'public/components/angular-mocks/angular-mocks.js',
      'public/components/angular-route/angular-route.min.js',
      'public/components/angular-sanitize/angular-sanitize.min.js',
      'public/components/marked/marked.',
      'public/components/marked/lib/marked.js',
      'public/components/angular-marked/angular-marked.js',
      'public/*.js',
      'public/controllers/*.js',
      'test/client/*Spec.js'
    ],
    exclude: [
    ],
    preprocessors: {
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  });
};
