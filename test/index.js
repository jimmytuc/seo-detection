import { assert, should, expect } from 'chai';
import * as Promise from 'bluebird';
import * as fs from 'fs';
import * as path from 'path';
import {
    Detection
} from '../src/detection';
import { beforeEach } from 'mocha';
const fromFile = Promise.promisify(fs.readFile);

describe('Constructor Test', () => {
    let filePath;
    beforeEach(function() {
        filePath = path.join(__dirname, './html/detect_header.html');
    });

    it('Should return instance', () => {
        const ins = new Detection;
        assert.notEqual(typeof ins, undefined);
    });
    it('Should able to overwrite config, cannot append new config', () => {
        // only allowed overwrite 2 config
        const ins = new Detection({
            allowedStrongTag: 15,
            output: 'file',
            abc: '123',
            xyz123: 999
        }, filePath);

        assert.equal(ins.config.allowedStrongTag, 15);
        assert.equal(ins.config.output, 'file');
        assert.isUndefined(ins.config.abc);
        assert.isUndefined(ins.config.xyz123);
        assert.isNotNull(ins.readPath);
        assert.equal(ins.readPath, filePath);
    });
    it('Should throw error if output is file and path was not be specified', () => {
        expect(() => {
            new Detection({ output: 'file' }, filePath).run();
        }).to.throw(Error);
        const writePath = path.join(__dirname, './html/output.txt');
        expect(() => {
            new Detection({ output: 'file' }, filePath)
            .toFile(writePath)
            .run();
        }).not.to.throw(Error);
        expect(() => {
            new Detection({ output: 'file', writeTo: writePath }, filePath)
            .run();
        }).not.to.throw(Error);
    });
    it('Should able to set meta rules config', () => {
        const ins1 = new Detection({
            allowedMetaTagRules: null
        }, filePath);
        assert.instanceOf(ins1.metaRules, Array);
        assert.notEqual(ins1.metaRules.indexOf('description'), -1);
        assert.notEqual(ins1.metaRules.indexOf('keywords'), -1);

        const ins2 = new Detection({
            allowedMetaTagRules: ['robots']
        }, filePath);
        assert.notEqual(ins2.config.allowedMetaTagRules.indexOf('robots'), -1);
    });
});
describe('File Manipulation Test', () => {
    let readFilePath, writeFilePath;
    beforeEach(function () {
        readFilePath = path.join(__dirname, './html/detect_header.html');
        writeFilePath = path.join(__dirname, './html/output.txt');
    });
    
    it('should able to read file', () => {
        const detectIns1 = new Detection(null, readFilePath);
        const detectIns2 = new Detection;
        detectIns2.fromFile(readFilePath);
        assert.equal(detectIns1.readPath, readFilePath);
        assert.equal(detectIns2.readPath, readFilePath);
    });
    it('should able to write file', (done) => {
        const ins = new Detection(null, readFilePath);
        ins.toFile(writeFilePath)
            .run()
            .then(() => {
                fromFile(writeFilePath)
                    .then(data => {
                        assert.isNotEmpty(data);
                        done();
                    })
                    .catch(assert.isUndefined)
            })
            .catch(assert.isUndefined);
    });
});
describe('Metatag Test', () => {
    let ins;
    let countInArray;
    before(function () {
        ins = new Detection;
        countInArray = (array, what) => {
            return array.filter(item => item == what).length;
        }
    });
    describe('Set meta tags rule', () => {
        it('should not include empty string', () => {
            ins.setMetaTagRules('');
            expect(ins.metaRules).to.be.an('array').that.does.not.include('');
        });
        it('should not include empty array', () => {
            ins.setMetaTagRules([]);
            expect(ins.metaRules).to.be.an('array').that.does.not.include(null);
        });
        // input as string
        it('should include new rule as string', () => {
            ins.setMetaTagRules('robots');
            expect(ins.metaRules).to.be.an('array').that.does.include('robots');
        });
        // input as array
        it('should include new rule as array', () => {
            ins.setMetaTagRules(['copyright', 'DC.title', 'og:title']);
            expect(ins.metaRules).to.be.an('array').that.does
                .include('DC.title')
                .include('copyright')
                .include('robots');
        });
        // check duplicate
        it('should not include duplicate rule', () => {
            ins.setMetaTagRules(['og:title', 'og:title']);
            expect(
                countInArray(ins.metaRules, 'og:title')
            ).to.not.gt(1);
        });
    });
});
describe('Test parse string', () => {
    let ins;
    before(function() {
        ins = new Detection;
    });
    
    it('should throw exception', () => {
        expect(() => ins.parseString(``)).to.throw(Error);
    })
});