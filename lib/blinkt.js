'use strict';

const log = require('seal-log').getLogger();

let leds;

try {
  const Blinkt = require('node-blinkt');

  leds = new Blinkt();
  log.info('Platform supported by Blinkt!');
} catch (e) {
  // Mock to run unit-tests on platforms not supported by Blinkt!
  leds = {
    clearAll () {},
    sendUpdate () {},
    setAllPixels () {},
    setPixel () {},
    setup () {}
  };
  log.error('Platform not supported by Blinkt!');
}

const shutdown = function () {
  log.info('Turning off lights.');

  leds.setAllPixels(0, 0, 0, 0);

  // Workaround: https://github.com/Irrelon/node-blinkt/issues/1
  leds.sendUpdate();
  leds.sendUpdate();

  /* eslint-disable no-process-exit */
  process.nextTick(() => {
    log.info('Terminating process.');
    process.exit(0);
  });
  /* eslint-enable no-process-exit */
};

const init = function () {
  leds.setup();
  leds.clearAll();

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  log.info('Initialized.');
};

const blinkt = function (colors) {
  colors = colors || [];

  colors.slice(-8).forEach((color, i) => {
    leds.setPixel(i, color.red, color.green, color.blue, 1);
  });

  for (let i = colors.length; i < 8; i++) {
    leds.setPixel(i, 0, 0, 0, 0);
  }

  // Workaround: https://github.com/Irrelon/node-blinkt/issues/1
  leds.sendUpdate();
  leds.sendUpdate();
};

init();

module.exports = blinkt;
