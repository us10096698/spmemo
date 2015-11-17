'use strict';

angular.module('spmemo', ['ngRoute', 'ngSanitize', 'hc.marked', 'ui.bootstrap'])
  .config(config);

function config($compileProvider, markedProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|blob):/);
  markedProvider.setOptions({gfm: true});
}
