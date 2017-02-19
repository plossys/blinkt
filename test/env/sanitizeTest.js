'use strict';

const assert = require('assertthat');

const sanitize = require('../../lib/env/sanitize');

suite('sanitize', () => {
  test('is a function.', (done) => {
    assert.that(sanitize).is.ofType('function');
    done();
  });

  test('returns an empty colors object if no input is given.', (done) => {
    assert.that(sanitize()).is.equalTo({});
    done();
  });

  suite('returns an empty colors object if the input', () => {
    test('does not only contain arrays.', (done) => {
      const input = {
        foo: [1, 2, 3],
        bar: 'baz'
      };

      assert.that(sanitize(JSON.stringify(input))).is.equalTo({});
      done();
    });

    test('contains arrays with less than 3 elements.', (done) => {
      const input = {
        foo: [1, 2]
      };

      assert.that(sanitize(JSON.stringify(input))).is.equalTo({});
      done();
    });

    test('contains arrays with more than 3 elements.', (done) => {
      const input = {
        foo: [1, 2, 3, 4]
      };

      assert.that(sanitize(JSON.stringify(input))).is.equalTo({});
      done();
    });

    test('contains arrays with other element types than numbers.', (done) => {
      const input = {
        foo: ['1', 2, 3]
      };

      assert.that(sanitize(JSON.stringify(input))).is.equalTo({});
      done();
    });

    test('contains arrays with values < 0.', (done) => {
      const input = {
        foo: [-1, 2, 3]
      };

      assert.that(sanitize(JSON.stringify(input))).is.equalTo({});
      done();
    });

    test('contains arrays with values > 255.', (done) => {
      const input = {
        foo: [1, 2, 256]
      };

      assert.that(sanitize(JSON.stringify(input))).is.equalTo({});
      done();
    });
  });

  test('returns a colors object defined by the sanitizeironment variable.', (done) => {
    const input = {
      foo: [1, 2, 3]
    };

    assert.that(sanitize(JSON.stringify(input))).is.equalTo(input);
    done();
  });

  test('accepts the color black (0, 0, 0).', (done) => {
    const input = {
      foo: [0, 0, 0]
    };

    assert.that(sanitize(JSON.stringify(input))).is.equalTo(input);
    done();
  });

  test('accepts the color white (255, 255, 255).', (done) => {
    const input = {
      foo: [255, 255, 255]
    };

    assert.that(sanitize(JSON.stringify(input))).is.equalTo(input);
    done();
  });

  test('handles labels containing a slash and colon.', (done) => {
    const input = {
      'plossys/foo:1.0.0': [1, 2, 3]
    };

    assert.that(sanitize(JSON.stringify(input))).is.equalTo(input);
    done();
  });
});
