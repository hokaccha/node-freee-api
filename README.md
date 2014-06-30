# node-freee-api

## Install

```
$ npm install freee-api
```

## Overview

[freee API v1.0](https://secure.freee.co.jp/developers/api/doc/v1.0.html) API Client.

```javascript
var Freee = require('freee-api');

// configure
Freee.configure({
  appId: config.appId,
  secret: config.secret,
  callback: config.callback
});

// get authorize URL
var url = Freee.getAuthorizeURL();

// fetch access token
Freee.fetchToken(req.query.code, function(err, token) {
  req.session.token = token;
});

// create client with token
var freee = new Freee(req.session.token);

// refresh token
if (freee.token.isExpired()) {
  freee.token.refresh(function(err, token) {
    req.session.token = token;
  });
}

// Call API
freee.me(function(err, user) {
  // ...
});

freee.companies(function(err, companies) {
  // ...
});

freee.walletables(companyId, function(err, walletables) {
  // ...
});

freee.walletTxns(params, function(err, walletTxns) {
  // ...
});

freee.accountItems(companyId, function(err, accountItems) {
  // ...
});

freee.deals(companyId, function(err, deals) {
  // ...
});

freee.items(companyId, function(err, items) {
  // ...
});

freee.partners(companyId, function(err, partners) {
  // ...
});

freee.taxes(companyId, function(err, taxes) {
  // ...
});

freee.transfers(companyId, function(err, transfers) {
  // ...
});
```

## Run example app

1. create new application from [here](https://secure.freee.co.jp/oauth/applications) and get appId and Secret.
2. Set callback url to `http://localhost:9000/callback`.
3. Run below commands.

```
$ git clone git@github.com:hokaccha/node-freee-api.git
$ cd node-freee-api
$ npm install
$ cd example/webapp
$ echo APP_ID=your-app-id >> .env
$ echo SECRET=your-app-secret >> .env
$ node app.js
```

## TODO

* Support POST API

## License

MIT
