# node-freee-api

## Install

```
$ npm install freee-api
```

## Overview

[freee API v1.0](https://secure.freee.co.jp/developers/api/doc/v1.0.html) API Client.

```javascript
var Freee = require('freee-api');
var freee = new Freee({
  appId: config.appId,
  secret: config.secret,
  callback: config.callback
});
```

```javascript
// getAuthorizeURL
var url = freee.getAuthorizeURL();
```

```javascript
// getAccessToken
freee.fetchToken(req.query.code, function(err, token) {
  // Call API
  freee.me(function(err, user) {
    console.log(user.email);
  });

  freee.companies(function(err, companies) {
    console.log(companies.name);
  });
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
