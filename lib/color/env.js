'use strict';

const getenv = require('getenv');

const env = function () {
  try {
    const result = JSON.parse(getenv('COLORS', '{}'));

    Object.keys(result).forEach((label) => {
      if (!Array.isArray(result[label])) {
        throw new Error(`'${label}' must be an array.`);
      }
      if (result[label].length !== 3) {
        throw new Error(`'${label}' must contain 3 values.`);
      }
      for (let i = 0; i < 3; i++) {
        if (typeof result[label][i] !== 'number' || result[label][i] < 0 || result[label][i] > 255) {
          throw new Error(`Values of '${label}' must be numbers between 0 and 255.`);
        }
      }
    });

    return result;
  } catch (e) {
    /* eslint-disable no-console */
    console.error('Error parsing the COLORS environment variable:', e.message);
    /* eslint-enable no-console */
    return {};
  }
};

module.exports = env;
