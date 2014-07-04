'use strict';

var utils = require('./utils');

module.exports = Token;

function Token(params) {
  this.set(params);
}

Token.prototype.set = function(params) {
  if (params.accessToken) {
    this.accessToken = params.accessToken;
  }

  if (params.refreshToken) {
    this.refreshToken = params.refreshToken;
  }

  if (params.expiresAt) {
    this.expiresAt = new Date(params.expiresAt);
  }
};

Token.prototype.refresh = function(fn) {
  var self = this;

  utils.callTokenApi({
    grant_type: 'refresh_token',
    refresh_token: this.refreshToken
  }, function(err, params) {
    if (err) return fn(err);

    self.set(params);
    fn(null, params);
  });
};

Token.prototype.isExpired = function() {
  return this.expiresAt < new Date();
};

Token.prototype.toJSON = function() {
  return {
    accessToken: this.accessToken,
    refreshToken: this.refreshToken,
    expiresAt: this.expiresAt
  };
};
