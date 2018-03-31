'use strict';
/**
 * by methods way
 */
const sd = require('../lib');
const path = require('path');

/** 
 * by default, options will be 
 * { allowedStrongTag: 1, output: 'console', allowedMetaTagRules: ['description','keywords'] } 
 */
const readInput = path.join(__dirname, './input/index.html');
const dectectInstance = new sd.Detection({}, readInput);
dectectInstance.run();