'use strict';

angular.module('spmemo')
  .factory('githubService', githubService);

githubService.$inject = ['$http', '$q', '$filter', 'memoService'];

function githubService($http, $q, $filter, memoService) {
  var githubService = {};
  var sessionObj = angular.fromJson(sessionStorage.getItem('spmemo-metadata')) || 
    {user : "-", repo: '-', files: []};

  githubService.updateFileList = updateFileList;
  githubService.getPath = getPath;
  githubService.getFiles = getFiles;
  githubService.openFile = openFile;
  githubService.saveAMemo = saveAMemo;
  githubService.auth = auth;

  var urlPrefix = 'https://api.github.com/repos/';

  return githubService;
  
  function getPath() {
    return sessionObj.user + '/' + sessionObj.repo;
  }

  function getFiles() {
    return sessionObj.files;
  }

  function auth() {
    $http.get('/api/hub/auth').then(
      function success(res) {
        console.log(res);
      }, function error(e) {
        console.log(e);
      });
  }

  function updateFileList(info) {
    var deferred = $q.defer();

    var user = info.user;
    var repo = info.repo;
    var fileList = [];

    $http({
      method: 'GET',
      url: 'https://api.github.com/repos/' +
        user + '/' + repo + '/contents/data'
    }).then(function success(res) {
      res.data.forEach( function(file, index, object){
        fileList.push({
          name: file.name,
          url: file.download_url,
          sha: file.sha
        });
      });

      sessionObj.user = user;
      sessionObj.repo = repo;
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

  function saveAMemo(filename) {
    var deferred = $q.defer();

    if(filename=='') deferred.reject('Current filename is not specified');

    var pathUrl = sessionObj.user + '/' + sessionObj.repo + '/contents/data/' + filename;
    var data = {
      path: pathUrl,
      sha: getSha(filename),
      content: memoService.getMemosAsJsonString(),
      message: 'Updated by SPMEMO'
    };

    $http({
      method: 'PUT',
      url: '/api/hub',
      port: 3000,
      data: angular.toJson(data)
    }).then(function success(res) {
      sessionObj.files.filter( function(item, index) {
        if (item.name == filename){
          item.sha = res.data.content.sha;
        }
      });
      deferred.resolve(filename);
    }, function error(res) {
      deferred.reject(res);
    });

    return deferred.promise;
  }

  function getSha(filename) {
    var ret = -1;
    var fileList = getFiles();
    fileList.filter(function(item, index) {
      if (item.name == filename){
        ret = item.sha;
      }
    });
    return ret;
  }
}
