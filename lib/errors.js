'use strict';

function APIError(err) {
  var e = Error.call(this);
  e.name = 'APIError';
  e.message = 'API Error';
  e.errors = err.errors;
  e.statusCode = err.status_code;
  return e;
}

APIError.prototype = Object.create(Error.prototype, { 
  constructor: { value: APIError } 
});

module.exports = {
  APIError: APIError
};
