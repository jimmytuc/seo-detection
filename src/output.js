import * as fs from 'fs';
import {
    curry,
    flatten,
    compose,
    over,
    join,
    filter
} from 'ramda';

const outputResult = compose(
    filter(item => item !== undefined), 
    flatten
);

const render = text => typeof text === 'string' ? text : outputResult(text).join('\n')

export function write(type) {
    switch(type) {
        case 'file':
            return curry((filePath, text) => {
                const streamToFile = fs.createWriteStream(filePath);
                streamToFile.write(
                    render(text)
                );
                streamToFile.end();
            });
        default:
            return curry(
                (text) => console.log(render(text))
            );
    }
}