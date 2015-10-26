var getRoot = require('../../app/routes/getRoot');

describe('hello API', function(){
    'use strict';
    var req, res;
  
    beforeEach( function(){
        req = {};
        res = {
            send: jasmine.createSpy().and.callFake(function(msg){
                return this;
            })
        };
    });
  
    afterEach(function() {
        expect(res.send.calls.count()).toEqual(1);
    });
  
    it('GET / should return response with a processed message', function(){
        req = {query: {message: 'hello'}};
        getRoot(req, res);
        expect(res.send).toHaveBeenCalledWith('processed: hello');
    });
});
