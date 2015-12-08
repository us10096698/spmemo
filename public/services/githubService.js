'use strict';

angular.module('spmemo')
  .factory('githubService', githubService);

githubService.$inject = ['$http'];

function githubService($http) {
  var githubService = {};
  var user;
  var repo;

  githubService.updateFileList = updateFileList;
  githubService.getPath = getPath;

  return githubService;
  
  function getPath() {
    return user + '/' + repo;
  }

  function updateFileList(info) {
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
    }, function error(res) {
    });

    return fileList;
  }
}
