'use strict';

const assert = require('assertthat');

const brightness = require('../lib/brightness');

/* eslint-disable camelcase */
const mockContainer = function () {
  return {
    stats (options, callback) {
      callback(null, {
        cpu_stats: {
          cpu_usage: {
            total_usage: 5,
            percpu_usage: [
              5,
              0,
              0,
              0
            ]
          },
          system_cpu_usage: 40
        },
        precpu_stats: {
          cpu_usage: {
            total_usage: 0,
            percpu_usage: [
              0,
              0,
              0,
              0
            ]
          },
          system_cpu_usage: 0
        }
      });
    }
  };
};
/* eslint-enable camelcase */

suite('brightness', () => {
  test('is a function.', (done) => {
    assert.that(brightness).is.ofType('function');
    done();
  });

  test('returns a brightness.', (done) => {
    const container = mockContainer();

    brightness(container, (err, actual) => {
      assert.that(err).is.null();

      // 0.1 (min) + 50% (CPU usage) von 0.9 (max - min)
      assert.that(actual).is.equalTo(0.55);
      done();
    });
  });
});
