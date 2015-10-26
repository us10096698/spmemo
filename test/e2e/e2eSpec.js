var server = require('../../server');

describe('GET /', function() {
    'use strict';
  
    beforeAll(function(){
        server.start();
    });
  
    afterAll(function(){
        server.close();
    });
  
    beforeEach(function(){
        browser.get('/');
    });
  
    it('should return index page with greeting', function(){
        expect(element(by.id('greeting')).getText()).toEqual('hello, world!');
    });
  
    it('should update tagline when call button clicked', function(){
        element(by.id('call')).click();
        expect(element(by.id('tagline')).getText()).toEqual('Did you call me?');
    });
  
    it('should update tagline when AJAX call button clicked', function(){
        element(by.id('ajaxcall')).click();
        expect(element(by.id('tagline')).getText()).toEqual('processed: Did you call me?');
    });
});
