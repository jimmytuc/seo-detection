import * as fs from 'fs';
import { Promise } from 'bluebird';
const promisifyReadFile = Promise.promisify(fs.readFile);
export const read = (filePath) => promisifyReadFile(filePath, { encoding: 'utf-8' });