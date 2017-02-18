'use strict';

const getenv = require('getenv');

const stack = require('../lib/stack');

stack(getenv.int('INTERVAL', 1000));
