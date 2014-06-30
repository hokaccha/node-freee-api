var assert = require('power-assert');
var sinon = require('sinon');
var Token = require('../lib/token');

describe('Token', function () {
  beforeEach(function() {
    this.token = new Token({ expiresAt: new Date('2014-01-10T15:00:00Z') });
  });

  describe('#isExpired', function() {

    context('When before expiration', function() {
      beforeEach(function() {
        this.clock = sinon.useFakeTimers(+new Date('2014-01-10T14:59:00Z'));
      });
      afterEach(function() {
        this.clock.restore();
      });

      it('should be false', function() {
        assert(this.token.isExpired() === false);
      });
    });

    context('When after expiration', function() {
      beforeEach(function() {
        this.clock = sinon.useFakeTimers(+new Date('2014-01-10T15:01:00Z'));
      });
      afterEach(function() {
        this.clock.restore();
      });

      it('should be true', function() {
        assert(this.token.isExpired() === true);
      });
    });
  });
});
