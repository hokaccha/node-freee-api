var simpleOauth2 = require('simple-oauth2');
var request = require('request');
var qs = require('querystring');
var _ = require('underscore');
var APIError = require('./api-error');

function Freee(opts) {
  this.config = {
    clientID: opts.appId,
    clientSecret: opts.secret,
    site: 'https://api.freee.co.jp',
    authorizationPath: '/oauth/authorize',
    tokenPath: '/oauth/token',
    callback: opts.callback
  };

  this._oauth = simpleOauth2(this.config);
  this._token = null;
}

Freee.prototype.getAuthorizeURL = function() {
  var authorizeEndPoint = 'https://secure.freee.co.jp/oauth/authorize';
  var params = {
    response_type: 'code',
    client_id: this.config.clientID,
    redirect_uri: this.config.callback
  };

  return authorizeEndPoint + '?' + qs.stringify(params);
};

Freee.prototype.fetchToken = function(code, fn) {
  var self = this;
  this._oauth.AuthCode.getToken({
    code: code,
    redirect_uri: this.config.callback
  }, function(err, token) {
    if (err) {
      fn(err);
    }
    else {
      var tokenObj = self._oauth.AccessToken.create(token);
      self._token = tokenObj.token;
      fn(null, tokenObj.token);
    }
  });
};

Freee.prototype.getToken = function() {
  return this._token;
};

Freee.prototype.setToken = function(token) {
  this._token = this._oauth.AccessToken.token = token;
};

Freee.prototype.hasToken = function() {
  return !!this._token;
};

Freee.prototype.removeToken = function() {
  this._token = null;
};

Freee.prototype.refreshToken = function(fn) {
  var self = this;
  this._oauth.AccessToken.refresh(function(err, tokenObj) {
    if (err) {
      fn(err);
    }
    else {
      self._token = tokenObj.token;
      fn(null, tokenObj.token);
    }
  });
};

Freee.prototype.isExpiredToken = function() {
  return this._oauth.AccessToken.expired();
};

Freee.prototype.call = function(opts, fn) {
  var self = this;

  if (!this.hasToken()) {
    fn(new Error('Not authorized'));
    return;
  }

  var query = _.extend({
    access_token: this._token.access_token
  }, opts.query);

  var params = {
    method: opts.method,
    url: this.config.site + opts.url,
    qs: query,
    json: true
  };

  request(params, function(err, response, body) {
    if (err) return fn(err);
    if (body.errors) return fn(new APIError(body));

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

module.exports = Freee;
