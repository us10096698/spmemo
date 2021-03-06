'use strict';

angular.module('spmemo')
    .controller('MainController', MainController);

MainController.$inject = ['$http', '$document', '$uibModal',
  'memoService', '$scope', 'toastr', 'githubService', 'storageService'];

function MainController($http, $document, $uibModal,
    memoService, $scope, toastr, githubService, storageService) {

  var vm = this;
  var sessionStorage = storageService.all();

  vm.memos = [];
  vm.href_ex = '';

  // sort
  vm.sortableOptions = { start: sortStart, stop: sortStop };
  var beforeIdx;

  vm.getAllMemos = getAllMemos;
  vm.importMemo = importMemo;
  vm.removeMemo = removeMemo;
  vm.editMemo = editMemo;
  vm.openGithubMemo = openGithubMemo;
  vm.saveToGithub = saveToGithub;
  vm.isActive = isActive;
  vm.loginstatus = isSignedIn();

  vm.user = githubService.getUser();
  vm.repo = githubService.getRepo();
  vm.files = githubService.getFiles();
  vm.currentIdx = githubService.getCurrentIdx();

  vm.openAddModal = openAddModal;
  vm.openGithubModal = openGithubModal;
  vm.copySucceed = copySucceed;
  vm.copyFailed = copyFailed;

  vm.auth = function() {
    githubService.auth();
  };

  // highlight
  var blocker = angular.element('#contentsTbl')[0];
  var observer = new MutationObserver( function(mutations) { render(); });
  var observerOpt = {characterData: true, childList:true, subtree: true};
  observer.observe(blocker, observerOpt);

  $document.ready(function() {
    angular.element('#lefile')[0]
      .addEventListener('change', handleFileSelect, false);
    getAllMemos();
  });

  function importMemo() {
    angular.element('#lefile').click();
  }

  function handleFileSelect(evt) {
    var file = evt.target.files[0];
    var reader = new FileReader();

    reader.onload = (function(theFile) {
      return function(e) {
        $scope.$apply(function() {
          sessionStorage.spmemo = e.target.result;
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

  function removeMemo(memoIdx, codeIdx) {
    vm.memos = memoService.remove(memoIdx, codeIdx);
    updateExportUrl();
  }

  function editMemo(index) {
    var item = memoService.getByIndex(index);
    memoService.set(item, index);
    openAddModal();
  }

  function openAddModal() {
    var modalInstance = $uibModal.open({
      templateUrl: '/views/templates/modal-memo.html',
      controller: 'MemoModalInstanceController',
      controllerAs: 'vm',
      size: 'lg'
    });

    modalInstance.result.then(function(item) {
      memoService.update(item, vm.memos);
      updateExportUrl();
    });
  }

  function openGithubModal() {
    var modalInstance = $uibModal.open({
      templateUrl: '/views/templates/modal-github.html',
      controller: 'GithubModalInstanceController',
      controllerAs: 'vm',
      size: 'md'
    });

    modalInstance.result.then(function(info) {
      githubService.updateFileList(info).then( function() {
        vm.files = githubService.getFiles();
        vm.user = githubService.getUser();
        vm.repo = githubService.getRepo();
        vm.currentIdx = githubService.getCurrentIdx();

        if (vm.files.length > 0) openGithubMemo(0);
      });
    });
  }

  function openGithubMemo(idx) {
    githubService.openFile(idx).then( function(res) {
      vm.memos = memoService.open(res);
      vm.currentIdx = githubService.getCurrentIdx();

      updateExportUrl();
    }, function(error) {
      toastr.error('Open failed: ' + error);
    });
  }

  function saveToGithub() {
    githubService.saveAMemo().then( function(res) {
      toastr.success(res + ': Succesfully saved!');
    }, function(res) {
      toastr.error('Save failed: ' + res);
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

  function isActive(i) {
    return (i == vm.currentIdx);
  }

  function isSignedIn() {
    githubService.isSignedIn().then(
      function(res) {
        vm.loginstatus = 'false';
        if (res) {
          vm.loginstatus = 'true';
        }
      }, function(err) {
      toastr.error('Check status failed: ' + err);
    });
  }

}
