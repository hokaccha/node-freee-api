'use strict';

var utils = require('./utils');

module.exports = Token;

function Token(params) {
  this.accessToken = params.accessToken;
  this.refreshToken = params.refreshToken;
  this.expiresAt = new Date(params.expiresAt);
}

Token.prototype.refresh = function(fn) {
  utils.callTokenApi({
    grant_type: 'refresh_token',
    refresh_token: this.refreshToken
  }, fn);
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
