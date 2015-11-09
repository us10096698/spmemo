'use strict';

angular.module('spmemo', ['ngRoute', 'ngSanitize', 'hc.marked', 'ui.bootstrap'])
  .config(markdown);

function markdown(markedProvider) {
  markedProvider.setOptions({gfm: true});
}
