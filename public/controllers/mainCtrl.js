'use strict';

angular.module('spmemo')
    .controller('MainController', MainController);

MainController.$inject = ['$http', '$document', '$uibModal', 'memoService', '$scope', 'toastr'];

function MainController($http, $document, $uibModal, memoService, $scope, toastr) {

  var vm = this;
  vm.memos = [];
  vm.href_ex = '';

  // sort
  vm.sortableOptions = { start: sortStart, stop: sortStop };
  var beforeIdx;

  vm.getAllMemos = getAllMemos;
  vm.importMemo = importMemo;
  vm.removeMemo = removeMemo;
  vm.editMemo = editMemo;

  vm.openModal = openModal;
  vm.copySucceed = copySucceed;
  vm.copyFailed = copyFailed;

  // highlight
  var blocker = angular.element('#contentsTbl')[0];
  var observer = new MutationObserver( function(mutations) { render(); });
  var observerOpt = {characterData: true, childList:true, subtree: true};
  observer.observe(blocker, observerOpt);

  $document.ready(function() {
    angular.element('#lefile')[0].addEventListener('change', handleFileSelect, false);
    getAllMemos();
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
          getAllMemos();
        });
      };
    })(file);

    reader.readAsText(file);
    angular.element('input[id=lefile]').val('');
  }

  function getAllMemos() {
    vm.memos = memoService.getAll();
    updateExportUrl();
  }

  function removeMemo(index) {
    memoService.remove(index);
    vm.memos.splice(index, 1);
    updateExportUrl();
  }

  function editMemo(index) {
    var item = memoService.get(index);
    memoService.set(item, index);
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
      memoService.update(item, vm.memos);
      updateExportUrl();
    });
  }

  function copySucceed() { toastr.success('Copied!'); }
  function copyFailed(err) { toastr.error('Copy failed', err);}

  function sortStart(evt, ui) { beforeIdx = ui.item.index(); }
  function sortStop(evt, ui) {
    var afterIdx = ui.item.index();

    if (beforeIdx != afterIdx) {
      memoService.sort(beforeIdx, afterIdx);
      updateExportUrl();
    }
  }

  function updateExportUrl() {
    vm.href_ex = memoService.getJsonUrl();
  }

  function render() {
    observer.disconnect();

    angular.forEach(angular.element('pre code'), function(block, index) {
      hljs.highlightBlock(block);
    });

    observer.observe(blocker, observerOpt);
  }

}
