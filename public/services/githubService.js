'use strict';

angular.module('spmemo')
  .factory('githubService', githubService);

githubService.$inject = ['$http', '$q', '$filter', 'memoService', 'storageService'];

function githubService($http, $q, $filter, memoService, storageService) {
  var githubService = {};

  var sessionStorage = storageService.all();
  var metadata = sessionStorage.spmemo_metadata 
  var urlPrefix = 'https://api.github.com/repos/';

  githubService.updateFileList = updateFileList;

  githubService.getUser = getUser;
  githubService.getRepo = getRepo;
  githubService.getFiles = getFiles;
  githubService.getCurrentIdx = getCurrentIdx;

  githubService.openFile = openFile;
  githubService.saveAMemo = saveAMemo;
  githubService.auth = auth;

  return githubService;
  
  function getUser() { return metadata.user; }
  function getRepo() { return metadata.repo; }
  function getFiles() { return metadata.files; }
  function getCurrentIdx() { return metadata.current; }

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
    })
    .then(function success(res) {

      res.data.forEach( function(file, index, object){
        fileList.push({
          name: file.name,
          url: file.download_url,
          sha: file.sha
        });
      });

      metadata.user = user;
      metadata.repo = repo;
      metadata.files = fileList;
      metadata.current = -1;

      sessionStorage.spmemo_metadata = metadata;

      deferred.resolve(fileList);

    }, function error(res) {
      deferred.reject(res);
    });

    return deferred.promise;
  }

  function openFile(idx) {
    var deferred = $q.defer();

    $http({
      method: 'GET',
      url: this.getFiles()[idx].url
    })
    .then(function success(res) {
      metadata.current = idx;
      sessionStorage.spmemo_metadata = metadata;
      deferred.resolve(res.data);
    }, function error(res) {
      deferred.reject(res);
    });

    return deferred.promise;
  }

  function saveAMemo() {
    var deferred = $q.defer();
    var filename = this.getFiles()[this.getCurrentIdx()].name;

    if ( filename == '')
      deferred.reject('Current filename is not specified');

    var pathUrl = metadata.user + '/' + metadata.repo + '/contents/data/' + filename;
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
      metadata.files.filter( function(item, index) {
        if (item.name == filename) {
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
