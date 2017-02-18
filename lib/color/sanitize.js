'use strict';

const sanitize = function (input) {
  try {
    const parsed = JSON.parse(input);

    Object.keys(parsed).forEach((label) => {
      if (!Array.isArray(parsed[label])) {
        throw new Error(`'${label}' must be an array.`);
      }
      if (parsed[label].length !== 3) {
        throw new Error(`'${label}' must contain 3 values.`);
      }
      for (let i = 0; i < 3; i++) {
        if (typeof parsed[label][i] !== 'number' || parsed[label][i] < 0 || parsed[label][i] > 255) {
          throw new Error(`Values of '${label}' must be numbers between 0 and 255.`);
        }
      }
    });

    return parsed;
  } catch (e) {
    /* eslint-disable no-console */
    console.error('Error parsing the COLORS environment variable:', e.message);
    /* eslint-enable no-console */
    return {};
  }
};

module.exports = sanitize;
