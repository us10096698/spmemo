'use strict';

angular.module('spmemo', ['ngRoute', 'ngSanitize', 'hc.marked'])
  .config(markdown);

function markdown(markedProvider) {
  markedProvider.setOptions({gfm: true});
}
