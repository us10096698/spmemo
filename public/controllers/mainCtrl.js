'use strict';

angular.module('spmemo')
    .controller('MainController', MainController);

MainController.$inject = ['$http', 'marked', '$timeout', '$document',
  '$uibModal', '$filter', 'memoService', '$scope'];

function MainController($http, marked, $timeout, $document, $uibModal, $filter, memoService, $scope) {

  var vm = this;

  vm.memos = {};
  vm.getAllMemos = get;
  vm.importMemo = importMemo;
  vm.openModal = openModal;
  vm.delete = removeItem;
  vm.edit = editItem;
  vm.href_ex = '';

  var blocker = angular.element('#contentsTbl')[0];
  var observer = new MutationObserver(function(mutations) {
    render();
    // mutations.forEach(function(mutation) {
      // console.log(mutation.type);
      //  if (mutation.type == 'childList') {
      // }
    // });
  });
  var observerOpt = {characterData: true, childList:true, subtree: true};

  observer.observe(blocker, observerOpt);

  // $scope.$watch(
    // function(){return vm.memos}, 
    // function(newVal, oldVal) {
      // console.log('changed');
      // render();
    // }
  // );

  $document.ready(function() {
    angular.element('#lefile')[0].addEventListener('change', handleFileSelect, false);
    get();
  });

  function importMemo(){
    angular.element('#lefile').click();
  }

  function handleFileSelect(evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();

    reader.onload = (function(theFile) {
      return function(e) {
        $scope.$apply(function() {
          sessionStorage.setItem('spmemo', e.target.result);
          get(); 
        });
      };
    })(file);

    reader.readAsText(file);
    angular.element('input[id=lefile]').val("");
  }

  function get() {
    vm.memos = {};
    var obj = angular.fromJson(sessionStorage.getItem('spmemo'));

    for (var key in obj) {
      var item = obj[key];
      vm.memos[key] = {title: item.title, doc: marked(item.doc), code: item.code};
    }

    saveMemosAsJson();
  }

  function saveMemosAsJson() {
    var blob = new Blob([sessionStorage.getItem('spmemo')], {'type': 'application/json'});
    window.URL = window.URL || window.webkitURL;
    vm.href_ex = window.URL.createObjectURL(blob);
  }

  function render() {
    observer.disconnect();

    angular.forEach(angular.element('pre code'), function(block, index) {
      hljs.highlightBlock(block);
    });

    observer.observe(blocker, observerOpt);
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
      saveMemosAsJson();
    });
  }
}
