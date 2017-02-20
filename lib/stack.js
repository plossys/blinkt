'use strict';

const async = require('async');
const debug = require('debug')('app:stack');
const Docker = require('dockerode');

const blinkt = require('./blinkt');
const brightness = require('./brightness');
const color = require('./color');

const docker = new Docker();

const stack = function (interval) {
  if (!interval) {
    throw new Error('Interval is missing.');
  }

  debug('Update interval: %d ms', interval);

  const removeSelf = function (containerInfos) {
    return containerInfos.filter((containerInfo) => {
      return !containerInfo.Image.startsWith('plossys/blinkt');
    });
  };

  const update = function () {
    debug('Update');
    docker.listContainers((errList, containerInfos) => {
      if (errList) {
        throw errList;
      }

      const colors = [];

      containerInfos = removeSelf(containerInfos).reverse();

      async.eachOfSeries(containerInfos, (containerInfo, index, done) => {
        const container = docker.getContainer(containerInfo.Id);
        const image = containerInfo.Image;

        debug('Image: %s', container, image);

        brightness(container, (errBrightness, result) => {
          if (errBrightness) {
            return done(errBrightness);
          }

          colors[index] = color(image).concat(result);
          done(null);
        });
      }, (err) => {
        if (err) {
          /* eslint-disable no-console */
          return console.log('Update failed.', err.message);
          /* eslint-enable no-console */
        }
        blinkt(colors);
      });
    });
  };

  setInterval(update, interval);
};

module.exports = stack;
