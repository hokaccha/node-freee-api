# node-freee-api-client

[https://secure.freee.co.jp/developers/api/doc/v1.0.html](freee API v1.0] API Client.

```javascript
var Freee = require('freee-api-client');
var freee = new Freee({
  appId: 'config.appId',
  secret: 'config.secret',
  callback: 'config.callback'
});

// getAuthorizeURL
var url = freee.getAuthorizeURL();

// getAccessToken
freee.getToken(req.query.code, function(err, result) {
  // setAccessToken
  freee.setToken(result);

  // Call API
  freee.me(function(err, response, body) {
    console.log(body.user.email);
  });

  freee.companies(function(err, response, body) {
    console.log(body.companies[0].name);
  });
});
```

## License

MIT
