'use strict';

const debug = require('debug')('app:env');
const getenv = require('getenv');

const sanitize = require('./sanitize');

let colors;

const env = function () {
  if (!colors) {
    colors = sanitize(getenv('COLORS', '{}'));
  }

  debug('Color map: %O', colors);
  return colors;
};

module.exports = env;
