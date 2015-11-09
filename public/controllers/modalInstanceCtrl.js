'use strict';

angular.module('spmemo')
  .controller('ModalInstanceController', ModalInstanceController);

ModalInstanceController.$inject = ['$uibModalInstance', '$filter', 'marked'];

function ModalInstanceController($uibModalInstance, $filter, marked) {
  var vm = this;

  vm.doc = '';
  vm.title = '';
  vm.code = '';

  vm.addMemo = add;
  vm.closeModal = closeModal;

  function add() {
    if (typeof(Storage) != 'undefined') {
      var json = $filter('json')({title: vm.title, doc: vm.doc, code: vm.code});
      sessionStorage.setItem(vm.title, json);
    }

    $uibModalInstance.close(
     {title: vm.title, doc: marked(vm.doc), code: vm.code}
    );
  }

  function closeModal() {
    $uibModalInstance.dismiss('cancel');
  }
}
