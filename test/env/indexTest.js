'use strict';

const assert = require('assertthat');

const env = require('../../lib/env');

suite('env', () => {
  test('is a function.', (done) => {
    assert.that(env).is.ofType('function');
    done();
  });
});
