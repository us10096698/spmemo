'use strict';

angular.module('spmemo')
    .controller('MainController', MainController);

MainController.$inject = ['$http', 'marked', '$timeout'];

function MainController($http, marked, $timeout) {
  var vm = this;

  vm.doc = '';
  vm.title = '';
  vm.code = '';
  vm.memos = [];

  vm.addMemo = function() {
    var encodedDoc = marked(vm.doc);

    var item = {title: vm.title, doc: encodedDoc, code: vm.code};
    vm.memos.push(item);

    $timeout(function() {
      angular.forEach(angular.element('pre code'), function(block, index) {
        hljs.highlightBlock(block);
      });
    }, 1000);
  };

}

