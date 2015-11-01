'use strict';

angular.module('spmemo')
    .controller('MainController', MainController);

MainController.$inject = ['$http'];

function MainController($http) {
  var vm = this;

  vm.doc = 'doc';
  vm.title = 'title';
  vm.code = 'code';
  vm.memos = [];

  vm.addMemo = function() {
    var item = {title: vm.title, doc: vm.doc, code: vm.code};
    vm.memos.push(item);
  };

  vm.process = function(message) {
    var config = {'params': {'message': message}};
    $http.get('/api/hello', config)
      .then(function callback(res) {
        vm.setTagline(res.data);
      });
  };
}
