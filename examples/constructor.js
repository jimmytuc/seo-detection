'use strict';

/**
 * by constructor ways
 */
const sd = require('../lib');
const fs = require('fs');
const path = require('path');

/** 
 * by default, options will be 
 * { allowedStrongTag: 1, output: 'console', allowedMetaTagRules: ['description','keywords'] } 
 */
const readInput = path.join(__dirname, './input/index.html');
const writeOutput = path.join(__dirname, './output/index.txt');

new sd.Detection(null, readInput)
    .dectectInstance.run(); // leave null for default config

// overwrite config
new sd.Detection({
    output: 'file',
    writeTo: writeOutput,
    allowedStrongTag: 1,
    allowedMetaTagRules: ['description','keywords','robots']
}, readInput)
    .run();