'use strict';

describe('HelloController', function() {
  beforeEach(module('spmemo'));

  var $controller, $httpBackend;

  beforeEach(inject(function(_$controller_, _$httpBackend_){
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('#setTagline should set a message', function() {
    var $scope = {};
    var controller = $controller('HelloController', {'$scope' : $scope });
    controller.setTagline('test');
    expect(controller.tagline).toEqual('test');
  });

  it('#getMessage should get a message from API', function() {
    var $scope = {};
    var controller = $controller('HelloController', {'$scope' : $scope });

    $httpBackend.expectGET('/api/hello?message=hello').respond('processed: hello');
    controller.process('hello');
    $httpBackend.flush();
    expect(controller.tagline).toBe('processed: hello');
  });
});
