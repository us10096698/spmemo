'use strict';

describe('MainController', function() {
  beforeEach(module('spmemo'));

  var $controller, $httpBackend;

  beforeEach(inject(function(_$controller_, _$httpBackend_) {
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should pass', function() {
    var $scope = {};
    var vm = $controller('MainController', {'$scope' : $scope });

    vm.title = 'title1';
    vm.doc = 'doc1';
    vm.code = 'code1';
    vm.addMemo();

    var expectMemos = [{title: 'title1', doc: '<p>doc1</p>\n', code: 'code1'}];
    expect(vm.memos).toEqual(expectMemos);
  });
});
