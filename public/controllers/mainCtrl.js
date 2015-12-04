'use strict';

angular.module('spmemo')
    .controller('MainController', MainController);

MainController.$inject = ['$http', 'marked', '$timeout', '$document',
  '$uibModal', '$filter', 'memoService', '$scope', 'toastr'];

function MainController($http, marked, $timeout, $document, $uibModal, $filter, memoService, $scope, toastr) {

  var vm = this;

  vm.memos = [];
  vm.getAllMemos = get;
  vm.importMemo = importMemo;
  vm.openModal = openModal;
  vm.delete = removeItem;
  vm.edit = editItem;
  vm.href_ex = '';
  vm.copySucceed = copySucceed;
  vm.copyFailed = copyFailed;
  vm.sortableOptions = { start: sortStart, stop: sortStop };

  var blocker = angular.element('#contentsTbl')[0];
  var observer = new MutationObserver(function(mutations) {
    render();
  });
  var observerOpt = {characterData: true, childList:true, subtree: true};

  observer.observe(blocker, observerOpt);

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
    angular.element('input[id=lefile]').val('');
  }

  function get() {
    vm.memos = [];
    var obj = angular.fromJson(sessionStorage.getItem('spmemo')) || [];

    obj.forEach( function(item, index, object) {
      vm.memos[index] = {title: item.title, doc: marked(item.doc), code: item.code};
    });

    saveMemosAsJson();
  }

  var beforeIdx;

  function sortStart(evt, ui) {
    beforeIdx = ui.item.index();
  }

  function sortStop(evt, ui) {
    var afterIdx = ui.item.index();

    if(beforeIdx != afterIdx){ 
      var sessionObj = angular.fromJson(sessionStorage.getItem('spmemo'));
      var itemToMove = sessionObj[beforeIdx];
      sessionObj.splice(beforeIdx, 1);
      sessionObj.splice(afterIdx, 0, itemToMove);
  
      var json = $filter('json')(sessionObj);
      sessionStorage.setItem('spmemo', json);   
      saveMemosAsJson();
    }
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

  function removeItem(index) {
    var obj = angular.fromJson(sessionStorage.getItem('spmemo'));
    obj.splice(index, 1);
    vm.memos.splice(index, 1);

    var json = $filter('json')(obj);
    sessionStorage.setItem('spmemo', json);
    saveMemosAsJson();
  }

  function editItem(index) {
    var obj = angular.fromJson(sessionStorage.getItem('spmemo'));
    var item = obj[index];

    memoService.setMemo(item, index);
    openModal();
  }

  function copySucceed() {
    toastr.success('Copied!');
  }

  function copyFailed(err) {
    toastr.error('Copy failed', err);
  }

  function openModal() {
    var modalInstance = $uibModal.open({
      templateUrl: '/views/templates/modal.html',
      controller: 'ModalInstanceController',
      controllerAs: 'vm',
      size: 'lg'
    });

    modalInstance.result.then(function(item) {
      var index = memoService.getIndex();

      if(index != (-1)){
        vm.memos[index] = item; 
      } else {
        vm.memos.push(item);
      }

      memoService.setIndex(-1);
      saveMemosAsJson();
    });
  }
}
