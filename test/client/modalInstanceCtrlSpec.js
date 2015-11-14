'use strict';

describe('MocalInstanceController', function() {
  beforeEach(module('spmemo'));

  var $controller;

  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  it('#addMemo should add a memo to session storage and return value', function() {
    var $scope = {};
    var $uibModalInstance = {
      'close': jasmine.createSpy().and.callThrough()
    };

    var vm = $controller('ModalInstanceController', {
      '$scope' : $scope,
      '$uibModalInstance': $uibModalInstance
    });

    vm.title = 'title1';
    vm.doc = 'doc1';
    vm.code = 'code1';
    vm.addMemo();

    var expectMemos = {title: 'title1', doc: '<p>doc1</p>\n', code: 'code1'};

    expect($uibModalInstance.close).toHaveBeenCalledWith(expectMemos);
  });
});