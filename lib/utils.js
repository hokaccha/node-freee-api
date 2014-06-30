'use strict';

var config = require('./config');
var utils = module.exports;
var request = require('request');

utils.callTokenApi = function callTokenApi(params, fn) {
  var basicAuth = new Buffer(config.appId + ':' + config.secret).toString('base64');

  request({
    method: 'POST',
    url: config.endpoint + config.tokenPath,
    json: true,
    form: params,
    headers: {
      Authorization: 'Basic ' + basicAuth
    }
  }, function(err, response, body) {
    if (err) return fn(err);

    if (body.error) {
      var e = new Error(body.error);
      e.description = body.error_description;
      fn(e);
    }
    else {
      fn(null, {
        refreshToken: body.refresh_token,
        accessToken: body.access_token,
        expiresAt: new Date(Date.now() + (body.expires_in * 1000))
      });
    }
  });
};
