'use strict';

const Docker = require('dockerode');

const blinkt = require('./blinkt');
const color = require('./color');

const docker = new Docker();

const stack = function (interval) {
  if (!interval) {
    throw new Error('Interval is missing.');
  }

  const removeSelf = function (containers) {
    return containers.filter((container) => {
      return !container.Image.startsWith('plossys/blinkt');
    });
  };

  const update = function () {
    docker.listContainers((err, containers) => {
      if (err) {
        throw err;
      }

      const colors = [];

      removeSelf(containers).reverse().forEach((container) => {
        colors.push(color(container.Image));
      });

      blinkt(colors);
    });
  };

  setInterval(update, interval);
};

module.exports = stack;
