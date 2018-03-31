'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.write = write;

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _ramda = require('ramda');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const outputResult = (0, _ramda.compose)((0, _ramda.filter)(item => item !== undefined), _ramda.flatten);

const render = text => typeof text === 'string' ? text : outputResult(text).join('\n');

function write(type) {
    switch (type) {
        case 'file':
            return (0, _ramda.curry)((filePath, text) => {
                const streamToFile = fs.createWriteStream(filePath);
                streamToFile.write(render(text));
                streamToFile.end();
            });
        default:
            return (0, _ramda.curry)(text => console.log(render(text)));
    }
}