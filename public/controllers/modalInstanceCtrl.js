'use strict';

angular.module('spmemo')
  .controller('MemoModalInstanceController', MemoModalInstanceController);

MemoModalInstanceController.$inject = ['$uibModalInstance', 'memoService'];

function MemoModalInstanceController($uibModalInstance, memoService) {
  var vm = this;
  var item = memoService.getByIndex();

  vm.title = item.title;
  vm.doc = item.doc || '';
  vm.code = item.code || [];
  vm.errFlag;

  vm.addMemo = add;
  vm.closeModal = closeModal;
  vm.addCodeBox = addCodeBox;

  function add() {
    errorCheck();
    if (typeof(Storage) != 'undefined' && !vm.errFlag) {
      var item = {title: vm.title, doc: vm.doc, code: vm.code};
      $uibModalInstance.close(item);
    }
  }

  function addCodeBox() {
    vm.code.push('');
  }

  function closeModal() {
    $uibModalInstance.dismiss('cancel');
  }

  function errorCheck() {
    vm.errFlag = false;

    if (!vm.title) {
      vm.errFlag = true;
    }
  }
}
