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
        expect(githubService.getUser()).toBe('testuser');
        expect(githubService.getRepo()).toBe('testrepo');
      });

    $httpBackend.flush();
  });

  it('#openFile should return memo object', function() {
    var data = [{title: 'test1', doc: 'doc', code: 'code'}];

    spyOn(githubService, 'getFiles').and.returnValue([
          {name: 'test.json', url: 'https://api.github.com/repos/testuser/testrepo/contents/data/test.json', sha: '123456'},
    ]);

    $httpBackend.expectGET('https://api.github.com/repos/testuser/testrepo/contents/data/test.json').respond(data);

    githubService.openFile(0).then(
      function(ret) {
        expect(ret).toEqual(data);
      }
    );
    $httpBackend.flush();
  });

  it('#saveAMemo should call its backend and return the filename when the request is success', function() {
    var filename = 'hoge';

    spyOn(githubService, 'getFiles').and.returnValue([
          {name: filename, url: 'fakeUrl', sha: 'fakesha'},
    ]);
    spyOn(githubService, 'getCurrentIdx').and.returnValue(0);

    $httpBackend.expectPUT('/api/hub')
      .respond({data: {content: {sha: 'fakesha'}}});

    githubService.saveAMemo().then( function(ret) {
      expect(ret).toBe(filename);
    });

    $httpBackend.flush();
  });

  it('#isSignedIn should return current login status', function() {
    $httpBackend.expectGET('/api/hub/status')
      .respond({status: true});
    githubService.isSignedIn().then(function(ret) {
      expect(ret).toEqual(true);
    });

    $httpBackend.flush();

  });
});
