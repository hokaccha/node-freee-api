'use strict';

var express = require('express');
var app = express();
var session = require('cookie-session');
var errorhandler = require('errorhandler');
var Freee = require('../../');
var dotenv = require('dotenv');
dotenv.load();

if (!process.env.APP_ID || !process.env.SECRET) {
  console.error('Error: process.env.APP_ID and process.env.SECRET are required');
  process.exit(1);
}

var port = process.env.PORT || 9000;

Freee.configure({
  appId: process.env.APP_ID,
  secret: process.env.SECRET,
  callback: 'http://localhost:' + port + '/callback'
});

app.use(express.static(__dirname + '/public'));
app.use(session({ keys: ['key'] }));

app.use(function(req, res, next) {

  if (!req.session.token) return next();

  req.freee = new Freee(req.session.token);

  if (!req.freee.token.isExpired()) return next();

  req.freee.token.refresh(function(err, token) {
    if (err) return next(err);

    req.session.token = token;
    next();
  });
});

app.get('/auth', function(req, res) {
  res.redirect(Freee.getAuthorizeURL());
});

app.get('/refresh', function(req, res, next) {
  req.freee.token.refresh(function(err, token) {
    if (err) return next(err);
    req.session.token = token;
    res.redirect('/');
  });
});

app.get('/callback', function(req, res, next) {
  Freee.fetchToken(req.query.code, function(err, token) {
    if (err) return next(err);
    req.session.token = token;
    res.redirect('/');
  });
});

app.get('/logout', function(req, res) {
  req.session.token = null;
  res.redirect('/');
});

app.get('/api/authinfo', function(req, res) {
  res.send({ signin: !!req.freee });
});

app.get('/api/token', function(req, res) {
  res.send(req.freee.token);
});

app.get('/api/me', function(req, res, next) {
  req.freee.me(function(err, result) {
    if (err) return next(err);
    res.send(result);
  });
});

app.get('/api/companies', function(req, res, next) {
  req.freee.companies(function(err, result) {
    if (err) return next(err);
    res.send(result);
  });
});

app.get('/api/walletables', function(req, res, next) {
  req.freee.walletables(req.query.company_id, function(err, result) {
    if (err) return next(err);
    res.send(result);
  });
});

app.get('/api/wallet_txns', function(req, res, next) {
  req.freee.walletTxns(req.query, function(err, result) {
    if (err) return next(err);
    res.send(result);
  });
});

app.get('/api/account_items', function(req, res, next) {
  req.freee.accountItems(req.query.company_id, function(err, result) {
    if (err) return next(err);
    res.send(result);
  });
});

app.get('/api/deals', function(req, res, next) {
  req.freee.deals(req.query.company_id, function(err, result) {
    if (err) return next(err);
    res.send(result);
  });
});

app.get('/api/items', function(req, res, next) {
  req.freee.items(req.query.company_id, function(err, result) {
    if (err) return next(err);
    res.send(result);
  });
});

app.get('/api/partners', function(req, res, next) {
  req.freee.partners(req.query.company_id, function(err, result) {
    if (err) return next(err);
    res.send(result);
  });
});

app.get('/api/taxes', function(req, res, next) {
  req.freee.taxes(req.query.company_id, function(err, result) {
    if (err) return next(err);
    res.send(result);
  });
});

app.get('/api/transfers', function(req, res, next) {
  req.freee.transfers(req.query.company_id, function(err, result) {
    if (err) return next(err);
    res.send(result);
  });
});

app.use(function(err, req, res, next) {
  if (err.name === 'APIError') {
    res.send({
      message: err.message,
      statusCode: err.statusCode,
      errors: err.errors
    });
  }
  else {
    next(err);
  }
});
app.use(errorhandler());

app.listen(9000, function() {
  console.log('Listening on port %d', this.address().port);
});
