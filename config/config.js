'use strict';

var upsenv = require('cfenv').getAppEnv().getServiceCreds('github') || {};

function configFactory() {
  var ret = {};
  var isProxy = process.env.USE_PROXY;

  ret.protocol = process.env.PROXY_PROTOCOL || 'https';
  ret.hubPort = isProxy ? process.env.PROXY_PORT : 443;
  ret.authPath = isProxy ? 'https://github.com' : '';
  ret.authHost = isProxy ? process.env.PROXY_HOST : 'github.com';
  ret.savePath = isProxy ? 'https://api.github.com/repos/' : '/repos/';
  ret.saveHost = isProxy ? process.env.PROXY_HOST : 'api.github.com';

  ret.serviceUrl = process.env.SPMEMO_SERVICE_URL;

  if (process.env.NODE_ENV == 'production') {
    ret.servicePort = require('cfenv').getAppEnv().port;
  } else {
    ret.servicePort = 3000;
  }

  ret.accessToken = process.env.SPMEMO_ACCESS_TOKEN;

  ret.clientId = upsenv.cid || process.env.SPMEMO_CLIENT_ID;
  ret.clientSecret = upsenv.csec || process.env.SPMEMO_CLIENT_SECRET;

  return ret;
}

module.exports = {
  configFactory: configFactory
};
