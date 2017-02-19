'use strict';

const getenv = require('getenv');

const sanitize = require('./sanitize');

let colors;

const env = function () {
  if (!colors) {
    colors = sanitize(getenv('COLORS', '{}'));
  }

  return colors;
};

module.exports = env;
