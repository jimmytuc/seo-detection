'use strict';
/**
 * by methods way
 */
const sd = require('../lib');
const path = require('path');

/** 
 * default allowedMetaTagRules: ['description','keywords']
 */
const readInput = path.join(__dirname, './input/index.html');

// constructor ways
new sd.Detection({ allowedMetaTagRules:['description', 'robots'] }, readInput)
    .run();

// method ways
new sd.Detection()
    .fromFile(readInput)
    .setMetaTagRules('robots') // can be either string or array
    .run();

// write file
const writeOutput = path.join(__dirname, './output/index.txt');
new sd.Detection()
    .fromFile(readInput)
    .toFile(writeOutput)
    .setMetaTagRules(['robots', 'cache-expire'])
    .run();
