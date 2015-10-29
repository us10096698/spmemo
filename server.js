'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var hello = require(__dirname + '/app/routes/hello.js');
var app = express();

var port = process.env.PORT || 3000;

exports.start = function() {
  if (!this.server) {
    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.urlencoded({'extended':'true'}));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); //parse application/vnd.api+json as json
    app.use(methodOverride()); //simulate DELETE/PUT

    // routes
    app.use('/api/hello', hello);

    // catch-all route
    app.get('*', function(req, res) {
      res.sendFile(__dirname + '/public/index.html');
    });

    // listen
    this.server = app.listen(port, function() {
      console.log('App listening on port ' + port);
    });
  }
};

exports.close = function() {
  this.server.close();
};

