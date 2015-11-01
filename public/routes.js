'use strict';

angular.module('spmemo')
.config(config);

function config($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainController',
      controllerAs: 'vm'
    });
}
