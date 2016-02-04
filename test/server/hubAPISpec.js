'use strict';

var nock = require('nock');
var hubAPI = require('../../app/api/hubAPI');
var config = require('../../config/env.json')[process.env.NODE_ENV || 'dev-local'];

describe('hubAPI', function() {
  var req = {
    query: { code: undefined }
  };
  var res = {
    redirect: function(){},
    writeHead: function(){},
    end: function(){}
  };

  it('#auth should redirect to the toppage when the access token is in the session', function(){
    req.session = {access_token : 'faketoken'};
    spyOn(res, 'redirect');

    hubAPI.auth(req, res);
    expect(res.redirect).toHaveBeenCalledWith(302, config.serviceUrl);
  });

  it('#auth should redirect to vaild authorize endpoint with valid query string', function() {
    req.session = {access_token : undefined};
    spyOn(res, 'writeHead');
    spyOn(res, 'end');
    hubAPI.auth(req, res);

    var expectedQuery = 'client_id=' + config.clientId + '&redirect_uri=' + encodeURIComponent(config.serviceUrl+ '/api/hub/auth') + '&scope=repo';
    var pathPrefix = config.proxy ? 'https://github.com' : '';

    expect(res.writeHead).toHaveBeenCalledWith(303, {Location: pathPrefix + '/login/oauth/authorize?' + expectedQuery});
    expect(res.end).toHaveBeenCalled();
  });

  it('#auth should redirect to service url when access_token has been gained', function(done) {
    req.query.code = 'fakecode';
    req.session = {access_token : undefined};

    var host = config.proxy ? 'http://' + config.proxy.host + ':8080' : 'https://github.com';
    var pathPrefix = config.proxy ? 'https://github.com' : '';

    var query =  
      "client_id=" + config.clientId + '&client_secret=' + config.clientSecret + 
      '&code=' + req.query.code + '&redirect_uri=' + encodeURIComponent(config.serviceUrl) 

    spyOn(res, 'redirect');

    var fake = nock(host)
      .defaultReplyHeaders({
          'Content-Type': 'application/json'
      })
      .post(pathPrefix + '/login/oauth/access_token?' + query)
      .reply(201, {access_token: 'faketoken'});

    hubAPI.auth(req, res);
    
    setTimeout( function(){
      expect(res.redirect).toHaveBeenCalledWith(302, config.serviceUrl);
      expect(req.session.access_token).toBe('faketoken');
      fake.done();
      done();
    }, 100);

  });
});
