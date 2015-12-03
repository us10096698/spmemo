'use strict';

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'public/components/jquery/dist/jquery.min.js',
      'public/components/jquery-ui/jquery-ui.min.js',
      'public/components/angular/angular.min.js',
      'public/components/angular-mocks/angular-mocks.js',
      'public/components/angular-route/angular-route.min.js',
      'public/components/angular-sanitize/angular-sanitize.min.js',
      'public/components/angular-animate/angular-animate.min.js',
      'public/components/angular-toastr/dist/angular-toastr.min.js',
      'public/components/marked/marked.min.js',
      'public/components/angular-marked/dist/angular-marked.js',
      'public/components/angular-bootstrap/ui-bootstrap.min.js',
      'public/components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'public/components/bootstrap/dist/js/bootstrap.min.js',
      'public/components/angular-ui-sortable/sortable.min.js',
      'public/components/angular-clipboard/angular-clipboard.js',
      'public/*.js',
      'public/controllers/*.js',
      'public/services/*.js',
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
