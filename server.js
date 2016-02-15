'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');

var config = require(__dirname + '/config/env.json')[process.env.NODE_ENV || 'dev-local'];

var hub = require(__dirname + '/app/routes/hub');
var app = express();

var port = config.appPort || process.env.PORT;

exports.start = function() {
  if (!this.server) {
    app.use(express.static(__dirname + '/public'));
    app.use(bodyParser.urlencoded({'extended':'true'}));
    app.use(bodyParser.json());
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); //parse application/vnd.api+json as json
    app.use(methodOverride()); //simulate DELETE/PUT

    // session
    var session_opt = {
      cookie: {secure: false}, // I'm gonna change this in dev/production
      name: 'spmemo.sid',
      secret: 'Can U keep a secret?',
      resave: false,
      saveUninitialized: false
    };

    if (app.get('env') == 'production') {
      app.set('trust proxy', 1);
      session_opt.cookie.sesure = true;
    }

    app.use(session(session_opt));

    if (process.env.NODE_ENV == 'production') app.use(requireHTTPS);

    // routes
    app.use('/api/hub', hub);

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

function requireHTTPS(req, res, next) {
  if (!req.secure) {
    return res.redirect('https://' + req.get('host') + req.url );
  }
  next();
}
