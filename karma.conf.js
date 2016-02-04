'use strict';

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      // bower:js
      'public/components/jquery/dist/jquery.js',
      'public/components/angular/angular.js',
      'public/components/angular-route/angular-route.js',
      'public/components/angular-bootstrap/ui-bootstrap-tpls.js',
      'public/components/angular-sanitize/angular-sanitize.js',
      'public/components/marked/lib/marked.js',
      'public/components/angular-marked/dist/angular-marked.js',
      'public/components/highlightjs/highlight.pack.js',
      'public/components/angular-clipboard/angular-clipboard.js',
      'public/components/angular-toastr/dist/angular-toastr.tpls.js',
      'public/components/angular-animate/angular-animate.js',
      'public/components/jquery-ui/jquery-ui.js',
      'public/components/angular-ui-sortable/sortable.js',
      // endbower
      'public/components/angular-mocks/angular-mocks.js',
      'public/*.js',
      'public/controllers/*.js',
      'public/services/*.js',
      'public/directives/*.js',
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
