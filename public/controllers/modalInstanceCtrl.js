'use strict';

angular.module('spmemo')
  .controller('ModalInstanceController', ModalInstanceController);

ModalInstanceController.$inject = ['$uibModalInstance', '$filter', 'marked', 'memoService'];

function ModalInstanceController($uibModalInstance, $filter, marked, memoService) {
  var vm = this;

  var item = memoService.getMemo();
  vm.doc = item.doc;
  vm.title = item.title;
  vm.code = item.code;
  vm.errFlag;

  vm.addMemo = add;
  vm.closeModal = closeModal;

  function add() {
    errorCheck();

    if (typeof(Storage) != 'undefined') {
      var obj = angular.fromJson(sessionStorage.getItem('spmemo'));

      if (obj == null) {
        obj = {};
      }

      if (!vm.errFlag) {
        obj[vm.title] = {title: vm.title, doc: vm.doc, code: vm.code};
        var json = $filter('json')(obj);
        sessionStorage.setItem('spmemo', json);

        $uibModalInstance.close(
          {title: vm.title, doc: marked(vm.doc), code: vm.code}
        );
      }
    }
  }

  function closeModal() {
    $uibModalInstance.dismiss('cancel');
  }

  function errorCheck() {
    vm.errFlag = false;

    if (!vm.title || !vm.code || !vm.doc) {
      vm.errFlag = true;
    }
  }
}
