'use strict';

angular.module('spmemo')
  .factory('storageService', storageService);

storageService.$inject = ['$sessionStorage'];

function storageService($sessionStorage) {

  $sessionStorage.$default({
    spmemo_metadata: {user : '-', repo: '-', files: [], current: undefined },
    spmemo: []
  });

  return {
    all: function() {
      return $sessionStorage;
    }
  };
}
