var simpleOauth2 = require('simple-oauth2');
var request = require('request');
var qs = require('querystring');
var _ = require('underscore');

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

Freee.prototype.getToken = function(code, fn) {
  this._oauth.AuthCode.getToken({
    code: code,
    redirect_uri: this.config.callback
  }, fn);
};

Freee.prototype.setToken = function(data) {
  this.token = this._oauth.AccessToken.create(data);
};

Freee.prototype.refreshToken = function(fn) {
  this.token.refresh(function(err, tokenObj) {
    if (err) {
      fn(err);
    }
    else {
      fn(null, tokenObj.token);
    }
  });
};

Freee.prototype.call = function(opts, fn) {
  var query = _.extend({
    access_token: this.token.token.access_token
  }, opts.query);

  var params = {
    method: opts.method,
    url: this.config.site + opts.url,
    qs: query,
    json: true
  };

  request(params, fn);
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
  this.get('/api/1/account_items.json', { company_id: companyId } , fn);
};

Freee.prototype.me = function(fn) {
  this.get('/api/1/users/me.json', fn);
};

Freee.prototype.companies = function(fn) {
  this.get('/api/1/companies.json', fn);
};

Freee.prototype.company = function(companyId, fields, fn) {
  var params = {};
  fields.forEach(function(field) {
    params[fields] = true;
  });
  this.get('/api/1/companies/' + companyId + '.json', params, fn);
};

Freee.prototype.amounts = function(fn) {
  this.get('/api/p/reports/amounts/current.json', fn);
};

Freee.prototype.deals = function(params, fn) {
  this.get('/api/1/deals.json', params, fn);
};

Freee.prototype.items = function(companyId, fn) {
  this.get('/api/1/items.json', { company_id: companyId }, fn);
};

Freee.prototype.partners = function(companyId, fn) {
  this.get('/api/1/partners.json', { company_id: companyId }, fn);
};

Freee.prototype.taxes = function(companyId, fn) {
  this.get('/api/1/taxes.json', { company_id: companyId }, fn);
};

Freee.prototype.transfers = function(params, fn) {
  this.get('/api/1/transfers.json', params, fn);
};

Freee.prototype.walletTxns = function(params, fn) {
  this.get('/api/1/wallet_txns.json', params, fn);
};

Freee.prototype.walletables = function(companyId, fn) {
  this.get('/api/1/walletables.json', { company_id: companyId }, fn);
};

module.exports = Freee;
