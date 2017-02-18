'use strict';

// See: https://github.com/ManoMarks/docker-swarm-visualizer/blob/master/src/data-provider.js
const toHash = function (text) {
  if (!text) {
    throw new Error('Text is missing.');
  }

  let hash = 0;

  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }

  return hash;
};

// See: https://github.com/ManoMarks/docker-swarm-visualizer/blob/master/src/data-provider.js
const toColor = function (hash) {
  if (!hash) {
    throw new Error('Hash is missing.');
  }

  const color = {};
  let i = 0;

  ['red', 'green', 'blue'].forEach((type) => {
    color[type] = (hash >> i++ * 8) & 0xFF;
  });

  return color;
};

const color = function (label) {
  if (!label) {
    throw new Error('Label is missing.');
  }

  return toColor(toHash(label));
};

module.exports = color;
