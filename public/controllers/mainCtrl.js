'use strict';

angular.module('spmemo')
    .controller('MainController', MainController);

MainController.$inject = ['$http', 'marked', '$timeout', '$document', '$uibModal', '$filter', 'memoService'];

function MainController($http, marked, $timeout, $document, $uibModal, $filter, memoService) {

  var vm = this;

  vm.memos = {};
  vm.getAllMemos = get;
  vm.openModal = openModal;
  vm.delete = removeItem;
  vm.edit = editItem;

  $document.ready(function() {
    get();
  });

  function get() {
    var obj = angular.fromJson(sessionStorage.getItem('spmemo'));

    for (var key in obj) {
      var item = obj[key];
      vm.memos[key] = {title: item.title, doc: marked(item.doc), code: item.code};
    }
    update();
  }

  function update() {
    $timeout(function() {
      angular.forEach(angular.element('pre code'), function(block, index) {
        hljs.highlightBlock(block);
      });
    }, 500);
  }

  function removeItem(id) {
    var obj = angular.fromJson(sessionStorage.getItem('spmemo'));
    delete obj[id];
    var json = $filter('json')(obj);
    sessionStorage.setItem('spmemo', json);
    delete  vm.memos[id];
  }

  function editItem(id) {
    var obj = angular.fromJson(sessionStorage.getItem('spmemo'));
    var item = obj[id];

    memoService.setMemo(item);
    openModal();
  }

  function openModal() {
    var modalInstance = $uibModal.open({
      templateUrl: '/views/templates/modal.html',
      controller: 'ModalInstanceController',
      controllerAs: 'vm',
      size: 'lg'
    });

    modalInstance.result.then(function(item) {
      vm.memos[item.title] = item;
      update();
    });
  }
}
