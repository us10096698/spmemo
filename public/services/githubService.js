'use strict';

angular.module('spmemo')
  .factory('githubService', githubService);

githubService.$inject = ['$http', '$q', '$filter', 'memoService'];

function githubService($http, $q, $filter, memoService) {
  var githubService = {};
  var user;
  var repo;
  var sessionObj = angular.fromJson(sessionStorage.getItem('spmemo-metadata')) || 
    {path : "-/-", files: []};

  githubService.updateFileList = updateFileList;
  githubService.getPath = getPath;
  githubService.getFiles = getFiles;
  githubService.openFile = openFile;

  var urlPrefix = 'https://api.github.com/repos/';

  return githubService;
  
  function getPath() {
    return sessionObj.path;
  }
  function getFiles() {
    return sessionObj.files;
  }

  function updateFileList(info) {
    var deferred = $q.defer();

    user = info.user;
    repo = info.repo;
    var fileList = [];

    $http({
      method: 'GET',
      url: 'https://api.github.com/repos/' +
        user + '/' + repo + '/contents/data'
    }).then(function success(res) {
      res.data.forEach( function(file, index, object){
        fileList.push({name: file.name, url: file.download_url});
      });

      sessionObj.path =  user + '/' + repo;
      sessionObj.files = fileList;
      sessionStorage.setItem('spmemo-metadata', $filter('json')(sessionObj));

      deferred.resolve(fileList);

    }, function error(res) {
      deferred.reject(res);
    });

    return deferred.promise;
  }

  function openFile(url) {
    var deferred = $q.defer();

    $http({
      method: 'GET', 
      url: url
    }).then(function success(res) {
      deferred.resolve(res.data);
    }, function error(res) {
      deferred.reject(res);
    });

    return deferred.promise;
  }
}
