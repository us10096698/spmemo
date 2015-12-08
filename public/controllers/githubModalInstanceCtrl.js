'use strict';

angular.module('spmemo')
  .controller('GithubModalInstanceController', GithubModalInstanceController);

GithubModalInstanceController.$inject = ['$uibModalInstance'];

function GithubModalInstanceController($uibModalInstance) {
  var vm = this;

  vm.userName;
  vm.repoName;
  vm.errFlag;

  vm.save = save;
  vm.closeModal = closeModal;

  function save() {
    var info = {user: vm.userName, repo: vm.repoName};
    $uibModalInstance.close(info);
  }

  function closeModal() {
    $uibModalInstance.dismiss('cancel');
  }
}
