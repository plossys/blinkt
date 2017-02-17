'use strict';

var Blinkt = require('node-blinkt'),
leds = new Blinkt();

var NUM_LEDS = 8;
var brightness = 0.1;

leds.setup();
leds.clearAll();

var lightsOff = function () {
  leds.setAllPixels(0, 0, 0, 0.1);
  leds.sendUpdate();
  leds.sendUpdate();
}

var signals = {
  'SIGINT': 2,
  'SIGTERM': 15
};

function shutdown(signal, value) {
  console.log('Stopped by ' + signal);
  lightsOff();
  process.nextTick(function () { process.exit(0); });
}

Object.keys(signals).forEach(function (signal) {
  process.on(signal, function () {
    shutdown(signal, signals[signal]);
  });
});

// ---- animation-loop
var offset = 0;
setInterval(function () {
  let red, green, blue;
  for (var i = 0; i < NUM_LEDS; i++) {
    [red, green, blue] = wheel(((i * 256 / NUM_LEDS) + offset) % 256);
    leds.setPixel(i, red, green, blue, brightness)
  }

	offset++;
  leds.sendUpdate();
}, 1000 / 30);

console.log('Rainbow started. Press <ctrl>+C to exit.');

// generate rainbow colors accross 0-255 positions.
function wheel(pos) {
  pos = 255 - pos;
  if (pos < 85) { return [255 - pos * 3, 0, pos * 3]; }
  else if (pos < 170) { pos -= 85; return [0, pos * 3, 255 - pos * 3]; }
  else { pos -= 170; return [pos * 3, 255 - pos * 3, 0]; }
}
