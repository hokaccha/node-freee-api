'use strict';

var request = require('request');
var qs = require('querystring');
var _ = require('underscore');
var errors = require('./errors');
var Token = require('./token');
var utils = require('./utils');
var config = require('./config');

module.exports = Freee;

function Freee(params) {
  this.token = new Token(params);
}

Freee.config = config;

Freee.configure = function(config) {
  return _.extend(Freee.config, config);
};

Freee.getAuthorizeURL = function() {
  var params = {
    response_type: 'code',
    client_id: config.appId,
    redirect_uri: config.callback
  };

  return config.authorizationEndpoint + '?' + qs.stringify(params);
};

Freee.fetchToken = function(code, fn) {
  utils.callTokenApi({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: config.callback
  }, fn);
};

Freee.prototype.call = function(opts, fn) {
  var self = this;

  var query = _.extend({
    access_token: this.token.accessToken
  }, opts.query);

  var params = {
    method: opts.method,
    url: config.endpoint + opts.url,
    qs: query,
    json: true
  };

  request(params, function(err, response, body) {
    if (err) return fn(err);
    if (body.errors) return fn(new errors.APIError(body));

    fn(null, body);
  });
};

Freee.prototype.get = function(url, query, fn) {
  if (typeof query === 'function') {
    fn = query;
    query = {};
  }

  this.call({
    method: 'GET',
    url: url,
    query: query
  }, fn);
};

Freee.prototype.accountItems = function(companyId, fn) {
  var params = { company_id: companyId };
  this.get('/api/1/account_items.json', params, createCallback(fn, 'account_items'));
};

Freee.prototype.me = function(fn) {
  this.get('/api/1/users/me.json', createCallback(fn, 'user'));
};

Freee.prototype.companies = function(fn) {
  this.get('/api/1/companies.json', createCallback(fn, 'companies'));
};

Freee.prototype.company = function(companyId, fields, fn) {
  var params = {};
  fields.forEach(function(field) {
    params[fields] = true;
  });
  this.get('/api/1/companies/' + companyId + '.json', params, createCallback(fn, 'company'));
};

Freee.prototype.deals = function(companyId, params, fn) {
  if (typeof params === 'function') {
    fn = params;
    params = {};
  }
  params.company_id = companyId;
  this.get('/api/1/deals.json', params, createCallback(fn, 'deals'));
};

Freee.prototype.items = function(companyId, fn) {
  var params = { company_id: companyId };
  this.get('/api/1/items.json', params, createCallback(fn, 'items'));
};

Freee.prototype.partners = function(companyId, fn) {
  var params = { company_id: companyId };
  this.get('/api/1/partners.json', params, createCallback(fn, 'partners'));
};

Freee.prototype.taxes = function(companyId, fn) {
  var params = { company_id: companyId };
  this.get('/api/1/taxes.json', params, createCallback(fn, 'taxes'));
};

Freee.prototype.transfers = function(companyId, params, fn) {
  if (typeof params === 'function') {
    fn = params;
    params = {};
  }
  params.company_id = companyId;
  this.get('/api/1/transfers.json', params, createCallback(fn, 'transfers'));
};

Freee.prototype.walletTxns = function(params, fn) {
  this.get('/api/1/wallet_txns.json', params, createCallback(fn, 'wallet_txns'));
};

Freee.prototype.walletables = function(companyId, fn) {
  var params = { company_id: companyId };
  this.get('/api/1/walletables.json', params, createCallback(fn, 'walletables'));
};

function createCallback(fn, field) {
  return function(err, result) {
    if (err) {
      fn(err);
    }
    else {
      fn(null, field ? result[field] : result);
    }
  };
}
