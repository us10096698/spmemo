'use strict';

var config = require('../../config/config').configFactory();
var http = require(config.protocol);
var querystring = require('querystring');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function saveFile(req, res) {
  var reqBody = req.body;
  var path = reqBody.path;
  var buffer = new Buffer(reqBody.content);
  var putData = JSON.stringify({
    'sha' : reqBody.sha,
    'content': buffer.toString('base64'),
    'message': reqBody.message
  });
  var options = {
    host: config.saveHost,
    port: config.hubPort,
    path: config.savePath + path,
    method: 'PUT',
    headers: {
      'Authorization': 'bearer ' + req.session.access_token, //TODO: error handling
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': putData.length,
      'User-Agent': 'SPMEMO'
    }
  };

  var resBody = '';
  var request = http.request(options, function(response) {
    response.setEncoding('utf8');
    response.on('data', function(chunk) {
      resBody += chunk;
    });

    response.on('end', function() {
      res.status(200).json(JSON.parse(resBody));
    });
  });

  request.on('error', function(e) {
    console.log('problem with request: ' + e.message);
    process.exit();
  });

  request.write(putData);
  request.end();
}

function auth(req, res) {
  if (req.session.access_token) {
    res.redirect(302, config.serviceUrl);

  } else if (config.accessToken) {
    req.session.access_token = config.accessToken;
    res.redirect(302, config.serviceUrl);

  } else if (req.query.code == undefined ) {
    getCode(req, res);

  } else {
    var query = querystring.stringify({
      'client_id': config.clientId,
      'client_secret': config.clientSecret,
      'code': req.query.code,
      'redirect_uri': config.serviceUrl
    });
    var options = {
      host: config.authHost,
      port: config.hubPort,
      path: config.authPath + '/login/oauth/access_token?' + query,
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      }
    };

    var request = http.request(options, function(response) {
      response.setEncoding('utf8');
      var resBody = '';

      response.on('data', function(chunk) {
        resBody += chunk;
      });

      response.on('end', function() {
        var access_token = JSON.parse(resBody).access_token;
        req.session.access_token = access_token;
        res.redirect(302, config.serviceUrl);
      });
    });

    request.on('error', function(e) {
      console.log('problem with request: ' + e.message);
      process.exit();
    });

    request.end();
  }
}

function getCode(req, res) {

  var query = querystring.stringify({
    client_id: config.clientId,
    redirect_uri: config.serviceUrl + '/api/hub/auth',
    scope: 'repo'
  });

  res.writeHead( 303, {
    Location: 'https://github.com/login/oauth/authorize?' + query
  });

  res.end();
}

function signOut(req, res) {
  req.session.destroy(function(err) {
    if (err != undefined) console.log(err);
  });
  res.redirect(302, config.serviceUrl);
}

function getStatus(req, res) {
  var status = false;
  if (req.session.access_token) status = true;
  res.send({'status': status});
}

module.exports = {
  saveFile: saveFile,
  auth: auth,
  signOut: signOut,
  getStatus: getStatus
};
