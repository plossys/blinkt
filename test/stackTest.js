'use strict';

const assert = require('assertthat');
const proxyquire = require('proxyquire');

let blinktColors;
let images;
const MockDocker = function () {
  this.listContainers = function (callback) {
    callback(null, images);
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

  test('is a function', (done) => {
    assert.that(stack).is.ofType('function');
    done();
  });

  test('calls blinkt.', (done) => {
    images = [{ Image: 'foo' }];

    stack(1);

    setTimeout(() => {
      assert.that(blinktColors).is.equalTo([
        {
          red: 198,
          green: 140,
          blue: 1
        }
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

  test('removes \'plossys/blinkt\' from container list.', (done) => {
    images = [{ Image: 'plossys/blinkt' }];

    stack(1);

    setTimeout(() => {
      assert.that(blinktColors).is.equalTo([]);
      done();
    }, 10);
  });

  test('removes \'plossys/blinkt:0.0.1\' from container list.', (done) => {
    images = [{ Image: 'plossys/blinkt:0.0.1' }];

    stack(1);

    setTimeout(() => {
      assert.that(blinktColors).is.equalTo([]);
      done();
    }, 10);
  });
});
