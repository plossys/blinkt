'use strict';

const assert = require('assertthat');
const nodeenv = require('nodeenv');

const env = require('../../lib/color/env');

suite('env', () => {
  test('is a function.', (done) => {
    assert.that(env).is.ofType('function');
    done();
  });

  test('returns an empty colors object if environment variable is not set.', (done) => {
    assert.that(env()).is.equalTo({});
    done();
  });

  suite('returns an empty colors object if the environment variable', () => {
    test('does not only contain arrays.', (done) => {
      const expected = {
        foo: [1, 2, 3],
        bar: 'baz'
      };

      nodeenv('COLORS', JSON.stringify(expected), (restore) => {
        assert.that(env()).is.equalTo({});
        restore();
        done();
      });
    });

    test('contains arrays with less than 3 elements.', (done) => {
      const expected = {
        foo: [1, 2]
      };

      nodeenv('COLORS', JSON.stringify(expected), (restore) => {
        assert.that(env()).is.equalTo({});
        restore();
        done();
      });
    });

    test('contains arrays with more than 3 elements.', (done) => {
      const expected = {
        foo: [1, 2, 3, 4]
      };

      nodeenv('COLORS', JSON.stringify(expected), (restore) => {
        assert.that(env()).is.equalTo({});
        restore();
        done();
      });
    });

    test('contains arrays with other element types than numbers.', (done) => {
      const expected = {
        foo: ['1', 2, 3]
      };

      nodeenv('COLORS', JSON.stringify(expected), (restore) => {
        assert.that(env()).is.equalTo({});
        restore();
        done();
      });
    });

    test('contains arrays with values < 0.', (done) => {
      const expected = {
        foo: [-1, 2, 3]
      };

      nodeenv('COLORS', JSON.stringify(expected), (restore) => {
        assert.that(env()).is.equalTo({});
        restore();
        done();
      });
    });

    test('contains arrays with values > 255.', (done) => {
      const expected = {
        foo: [1, 2, 256]
      };

      nodeenv('COLORS', JSON.stringify(expected), (restore) => {
        assert.that(env()).is.equalTo({});
        restore();
        done();
      });
    });
  });

  test('returns a colors object defined by the environment variable.', (done) => {
    const expected = {
      foo: [1, 2, 3]
    };

    nodeenv('COLORS', JSON.stringify(expected), (restore) => {
      assert.that(env()).is.equalTo(expected);
      restore();
      done();
    });
  });

  test('accepts the color black (0, 0, 0).', (done) => {
    const expected = {
      foo: [0, 0, 0]
    };

    nodeenv('COLORS', JSON.stringify(expected), (restore) => {
      assert.that(env()).is.equalTo(expected);
      restore();
      done();
    });
  });

  test('accepts the color white (255, 255, 255).', (done) => {
    const expected = {
      foo: [255, 255, 255]
    };

    nodeenv('COLORS', JSON.stringify(expected), (restore) => {
      assert.that(env()).is.equalTo(expected);
      restore();
      done();
    });
  });

  test('handles labels containing a slash and colon.', (done) => {
    const expected = {
      'plossys/foo:1.0.0': [1, 2, 3]
    };

    nodeenv('COLORS', JSON.stringify(expected), (restore) => {
      assert.that(env()).is.equalTo(expected);
      restore();
      done();
    });
  });
});
