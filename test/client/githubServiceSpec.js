'use strict';

describe('githubService', function() {
  beforeEach(module('spmemo'));

  var githubService;
  var $httpBackend;

  beforeEach( inject(function($injector) {
    githubService = $injector.get('githubService');
    $httpBackend = $injector.get('$httpBackend');
  }));

  afterEach( function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('#updateFilelist should return a valid file list', function() {
    
    var data = [
      {name: 'test1.json', download_url: 'http://example.com/test1.json'},
      {name: 'test2.json', download_url: 'http://example.com/test2.json'},
      {name: 'test3.json', download_url: 'http://example.com/test3.json'}
    ];

    $httpBackend.expectGET('https://api.github.com/repos/testuser/testrepo/contents/data')
      .respond(data);

    var fileList = githubService.updateFileList({user: 'testuser', repo: 'testrepo'});
    $httpBackend.flush();

    var expectedFileList = [
      {name: 'test1.json', url: 'http://example.com/test1.json'},
      {name: 'test2.json', url: 'http://example.com/test2.json'},
      {name: 'test3.json', url: 'http://example.com/test3.json'}
    ];

    expect(fileList).toEqual(expectedFileList);
  });
});
