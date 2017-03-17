'use strict';

const assert = require('assertthat');
const proxyquire = require('proxyquire');

let blinktColors;
let images;
const MockDocker = function () {
  this.listContainers = function (callback) {
    callback(null, images);
  };
  this.getContainer = function () {
    return {
      stats (container, callback) {
        callback(null);
      }
    };
  };
};
const stack = proxyquire('../lib/stack', {
  dockerode: MockDocker,
  './blinkt' (colors) {
    blinktColors = colors;
  }
});

suite('stack', () => {
  setup(() => {
    blinktColors = null;
    images = [];
  });

  test('is a function.', (done) => {
    assert.that(stack).is.ofType('function');
    done();
  });

  test('throws an error if interval is missing.', (done) => {
    assert.that(() => {
      stack();
    }).is.throwing('Interval is missing.');
    done();
  });

  test('calls blinkt.', (done) => {
    images = [{ Image: 'foo' }];

    stack(1);

    setTimeout(() => {
      assert.that(blinktColors).is.equalTo([
        [
          198,
          140,
          1,
          0.1
        ]
      ]);
      done();
    }, 10);
  });

  test('calls blinkt even if no container is running.', (done) => {
    images = [];

    stack(1);

    setTimeout(() => {
      assert.that(blinktColors).is.equalTo([]);
      done();
    }, 10);
  });
});
