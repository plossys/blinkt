'use strict';

const Blinkt = require('node-blinkt'),
leds = new Blinkt();

const NUM_LEDS = 8;
const brightness = 0.1;

let updateInterval;

leds.setup();
leds.clearAll();

const lightsOff = function () {
  leds.setAllPixels(0, 0, 0, 0.1);
  leds.sendUpdate();
  leds.sendUpdate();
}

const signals = {
  'SIGINT': 2,
  'SIGTERM': 15
};

const shutdown = function (signal, value) {
  console.log('Stopped by ' + signal);
  clearInterval(updateInterval);
  lightsOff();
  setTimeout(() => { process.exit(0); }, 1000);
}

Object.keys(signals).forEach(function (signal) {
  process.on(signal, function () {
    shutdown(signal, signals[signal]);
  });
});

// generate rainbow colors accross 0-255 positions.
const wheel = function (pos) {
  pos = 255 - pos;
  if (pos < 85) { return [255 - pos * 3, 0, pos * 3]; }
  else if (pos < 170) { pos -= 85; return [0, pos * 3, 255 - pos * 3]; }
  else { pos -= 170; return [pos * 3, 255 - pos * 3, 0]; }
}

// ---- animation-loop
let offset = 0;
updateInterval = setInterval(function () {
  let red, green, blue;
  for (let i = 0; i < NUM_LEDS; i++) {
    [red, green, blue] = wheel(((i * 256 / NUM_LEDS) + offset) % 256);
    leds.setPixel(i, red, green, blue, brightness)
  }
  leds.sendUpdate();
  leds.sendUpdate();
  offset += 3;
}, 1000 / 30);

console.log('Rainbow started. Press <ctrl>+C to exit.');
