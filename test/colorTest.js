'use strict';

const assert = require('assertthat');
const getenv = require('getenv');
const nodeenv = require('nodeenv');
const proxyquire = require('proxyquire');

const sanitize = require('../lib/env/sanitize');

const color = proxyquire('../lib/color', {
  './env' () {
    // Do not cache the result for the tests
    return sanitize(getenv('COLORS', '{}'));
  }
});

suite('color', () => {
  test('is a function.', (done) => {
    assert.that(color).is.ofType('function');
    done();
  });

  test('throws an error if label is missing.', (done) => {
    assert.that(() => {
      color();
    }).is.throwing('Label is missing.');
    done();
  });

  test('returns a color.', (done) => {
    assert.that(color('foo')).is.equalTo([
      198,
      140,
      1
    ]);
    done();
  });

  test('returns constant color for the same label.', (done) => {
    const expected = color('foo');

    assert.that(color('foo')).is.equalTo(expected);
    done();
  });

  test('returns different colors for different labels.', (done) => {
    const expected = color('foo');

    assert.that(color('bar')).is.not.equalTo(expected);
    done();
  });

  suite('with COLORS environment variable', () => {
    test('returns the color for a exact match.', (done) => {
      const colors = {
        'foo/bar:v1.0': [1, 2, 3]
      };

      nodeenv('COLORS', JSON.stringify(colors), (restore) => {
        assert.that(color('foo/bar:v1.0')).is.equalTo([1, 2, 3]);
        restore();
        done();
      });
    });

    test('returns the color for a matching image without tag.', (done) => {
      const colors = {
        'foo/bar': [1, 2, 3]
      };

      nodeenv('COLORS', JSON.stringify(colors), (restore) => {
        assert.that(color('foo/bar:v1.0')).is.equalTo([1, 2, 3]);
        restore();
        done();
      });
    });

    test('returns the color for a matching image without tag delimited by \'@\'.', (done) => {
      const colors = {
        'foo/bar': [1, 2, 3]
      };

      nodeenv('COLORS', JSON.stringify(colors), (restore) => {
        assert.that(color('foo/bar@sha256:123456789')).is.equalTo([1, 2, 3]);
        restore();
        done();
      });
    });
  });
});
