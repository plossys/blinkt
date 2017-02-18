'use strict';

const Docker = require('dockerode');

const blinkt = require('./blinkt');
const color = require('./color');

const docker = new Docker();

const stack = function (interval) {
  const removeSelf = function (containers) {
    return containers.filter((container) => {
      return container.Image !== 'plossys/blinkt';
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

  setInterval(update, interval || 1000);
};

module.exports = stack;
