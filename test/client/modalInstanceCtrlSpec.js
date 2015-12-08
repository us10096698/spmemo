'use strict';

describe('ModalInstanceController', function() {
  beforeEach(module('spmemo'));

  var $controller;

  beforeEach( inject( function(_$controller_) {
    $controller = _$controller_;
  }));

  it('#addMemo should add a memo to session storage and return value', function() {
    var $scope = {};
    var $uibModalInstance = {
      'close': jasmine.createSpy().and.callThrough()
    };

    var vm = $controller('MemoModalInstanceController', {
      '$scope' : $scope,
      '$uibModalInstance': $uibModalInstance
    });

    vm.title = 'title1';
    vm.doc = 'doc1';
    vm.code = 'code1';
    vm.addMemo();

    var expectMemos = {title: 'title1', doc: 'doc1', code: 'code1'};

    expect($uibModalInstance.close).toHaveBeenCalledWith(expectMemos);
  });
});
