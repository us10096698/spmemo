'use strict';

angular.module('spmemo')
    .controller('HelloController', HelloController);

HelloController.$inject = ['$http'];

function HelloController($http) {
  var vm = this;

  vm.doc = 'doc';
  vm.title = 'title';
  vm.code = 'code';

  vm.memos = [
    { title: 'title1', doc: 'doc1', code: 'code1'},
    { title: 'title2', doc: 'doc2', code: 'code2'}
  ];

  vm.addMemo = function() {
  };

  vm.process = function(message) {
    var config = {'params': {'message': message}};
    $http.get('/api/hello', config)
      .then(function callback(res) {
        vm.setTagline(res.data);
      });
  };
}
