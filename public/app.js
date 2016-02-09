'use strict';

angular.module('spmemo', ['ngRoute', 'ngSanitize', 'hc.marked',
    'ui.bootstrap', 'angular-clipboard', 'ngAnimate', 'toastr',
    'ui.sortable', 'ngStorage'])
  .config(config);

function config($compileProvider, markedProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|blob):/);
  markedProvider.setOptions({gfm: true});
}

