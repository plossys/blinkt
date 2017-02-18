'use strict';

/* eslint-disable no-console */

let leds;

try {
  const Blinkt = require('node-blinkt');

  leds = new Blinkt();
  console.log('Platform supported by Blinkt!');
} catch (e) {
  // Mock to run unit-tests on platforms not supported by Blinkt!
  leds = {
    clearAll () {},
    sendUpdate () {},
    setAllPixels () {},
    setPixel () {},
    setup () {}
  };
  console.error('Platform not supported by Blinkt!');
}

const shutdown = function () {
  console.log('Turning off lights.');

  leds.setAllPixels(0, 0, 0, 0);

  // Workaround: https://github.com/Irrelon/node-blinkt/issues/1
  leds.sendUpdate();
  leds.sendUpdate();

  /* eslint-disable no-process-exit */
  process.nextTick(() => {
    console.log('Terminating process.');
    process.exit(0);
  });
  /* eslint-enable no-process-exit */
};

const init = function () {
  leds.setup();
  leds.clearAll();

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  console.log('Initialized.');
};

const blinkt = function (colors) {
  colors = colors || [];

  colors.slice(-8).forEach((color, i) => {
    leds.setPixel(7 - i, color[0], color[1], color[2], 0.3);
  });

  for (let i = 0; i < 8 - colors.length; i++) {
    leds.setPixel(i, 0, 0, 0, 0);
  }

  // Workaround: https://github.com/Irrelon/node-blinkt/issues/1
  leds.sendUpdate();
  leds.sendUpdate();
};

init();

module.exports = blinkt;
