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

  const update = function () {
    debug('Update');
    docker.listContainers((errList, containerInfos) => {
      if (errList) {
        throw errList;
      }

      const colors = [];

      containerInfos = containerInfos.reverse();

      async.eachOfSeries(containerInfos, (containerInfo, index, done) => {
        const container = docker.getContainer(containerInfo.Id);
        let image = containerInfo.Image;

        if (image.startsWith('sha256:')) {
          // "/checkout-8b399c25-ccdf-8337-401a-8f723598fb54" -> checkout
          image = containerInfo.Names[0].match(/([^/-]+)/)[0];
        }

        debug('Image: %s', JSON.stringify(container), image);

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
