'use strict';

const assert = require('assertthat');

const color = require('../lib/color');

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
    assert.that(color('foo')).is.equalTo({
      red: 198,
      green: 140,
      blue: 1
    });
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
});
