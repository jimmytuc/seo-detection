'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.read = undefined;

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _bluebird = require('bluebird');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const promisifyReadFile = _bluebird.Promise.promisify(fs.readFile);
const read = exports.read = filePath => promisifyReadFile(filePath, { encoding: 'utf-8' });