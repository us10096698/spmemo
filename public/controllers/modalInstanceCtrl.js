'use strict';

angular.module('spmemo')
  .controller('ModalInstanceController', ModalInstanceController);

ModalInstanceController.$inject = ['$uibModalInstance', 'memoService'];

function ModalInstanceController($uibModalInstance, memoService) {
  var vm = this;
  var item = memoService.get();

  vm.title = item.title;
  vm.doc = item.doc || '';
  vm.code = item.code || '';
  vm.errFlag;

  vm.addMemo = add;
  vm.closeModal = closeModal;

  function add() {
    errorCheck();
    if (typeof(Storage) != 'undefined' && !vm.errFlag) {
      var item = {title: vm.title, doc: vm.doc, code: vm.code};
      $uibModalInstance.close(item);
    }
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
