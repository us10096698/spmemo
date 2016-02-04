'use strict';

describe('githubService', function() {
  beforeEach(module('spmemo'));

  var githubService;
  var $httpBackend;

  beforeEach( inject( function($injector) {
    githubService = $injector.get('githubService');
    $httpBackend = $injector.get('$httpBackend');
  }));

  afterEach( function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('#updateFilelist should return a valid file list', function() {
    
    var data = [
      {name: 'test1.json', download_url: 'http://example.com/test1.json', sha: '123456'},
      {name: 'test2.json', download_url: 'http://example.com/test2.json', sha: '234567'},
      {name: 'test3.json', download_url: 'http://example.com/test3.json', sha: '345678'}
    ];

    $httpBackend.expectGET('https://api.github.com/repos/testuser/testrepo/contents/data')
      .respond(data);

    githubService.updateFileList({user: 'testuser', repo: 'testrepo'})
      .then(function(fileList) {
        var expectedFileList = [
          {name: 'test1.json', url: 'http://example.com/test1.json', sha: '123456'},
          {name: 'test2.json', url: 'http://example.com/test2.json', sha: '234567'},
          {name: 'test3.json', url: 'http://example.com/test3.json', sha: '345678'}
        ];
    
        expect(fileList).toEqual(expectedFileList);
        expect(githubService.getPath()).toBe('testuser/testrepo');
      });

    $httpBackend.flush();
  });

  it('#openFile should return memo object', function() {
    var data = [{title: 'test1', doc: 'doc', code: 'code'}];

    $httpBackend.expectGET('https://api.github.com/repos/testuser/testrepo/contents/data/test.json').respond(data);
    githubService.openFile('https://api.github.com/repos/testuser/testrepo/contents/data/test.json').then(
      function(ret) {
        expect(ret).toEqual(data);
      }
    );
    $httpBackend.flush();
  });

  it('#saveAMemo should call its backend and return the filename when the request is success', function() {
    var filename = 'hoge';

    $httpBackend.expectPUT('/api/hub')
      .respond({data: {content: {sha: 'fakesha'}}});

    githubService.saveAMemo(filename).then( function(ret) {
      expect(ret).toBe(filename);
    });

    $httpBackend.flush();
  });
});
