import { assert, should, expect } from 'chai';
import * as Promise from 'bluebird';
import * as fs from 'fs';
import * as path from 'path';
import DomParser from 'dom-parser';
import {
    curry,
    head
} from 'ramda';

import {
    detectTagsWithoutAttribs,
    detectCountTagExccedLimit,
    detectMetaTags,
    detectRequiredTags
} from '../src/seo';
import { beforeEach } from 'mocha';
const fromFile = Promise.promisify(fs.readFile);



// test detect count tags exceed allowed limit

// test detect required tags

describe('Tag Detection Test', () => {
    let filePath;
    let dom;
    let getTag;
    before(function() {
        filePath = path.join(__dirname, './html/detect_header.html');
        let buffer = fs.readFileSync(filePath);
        getTag = curry((domParser, tagName) => {
            return domParser.getElementsByTagName(tagName);
        });
        dom = new DomParser();
    });
    // test detect tags without required attribs
    describe('Should able to detect required tags', () => {
        let domParser;
        before(function() {
            let htmlString = `<!DOCTYPE html>
            <html lang="en">
            <head>
            </head>
            <body>
            </body>`;
            domParser = dom.parseFromString(htmlString);
        });
        it('Check empty tags required', () => {
            expect(function() {
                detectRequiredTags();
                detectRequiredTags(1, []);
            }).to.throw(Error);
        });
        it('Check <title> in <head> tag', () => {
            let tagType = 'title';
            const headTag = getTag(domParser)('head');
            const headNode = head(headTag);
            const insideHeadTag = getTag(headNode);
            const messages = detectRequiredTags(insideHeadTag(tagType), 1, tagType);
            expect(messages).to.be.string(`<${tagType}> should be used in the HTML`);
        });
        it('Check <h1> in HTML', () => {
            let tagType = 'h1';
            const h1Tag = getTag(domParser)(tagType);
            const messages = detectRequiredTags(h1Tag, 1, tagType);
            expect(messages).to.be.string(`<${tagType}> should be used in the HTML`);
        });
    });
    describe('Should able to detect tags which required attributes', () => {
        let domParser;
        before(function() {
            let htmlString = `<!DOCTYPE html>
            <html lang="en">
            <head>
            </head>
            <body>
            <img/>
            <img alt="">
            <img alt="lorem ipsum">
            <p></p>
            </body>`;
            domParser = dom.parseFromString(htmlString);
        });
        it('Check empty tags required attributes', () => {
            expect(function() {
                detectTagsWithoutAttribs();
                detectTagsWithoutAttribs(1, []);
            }).to.throw(Error);
        });
        it('Check tag required attributes', () => {
            const imgsTag = getTag(domParser)('img');
            expect(detectTagsWithoutAttribs(imgsTag, 'alt')).to.be.an('array').has.length(2);
            const asTag = getTag(domParser)('a');
            expect(detectTagsWithoutAttribs(asTag, 'rel')).to.be.an('array').has.length(0);
        });
    });

    describe('Should able to detect number of tags exceeds limit', () => {
        let domParser;
        before(function() {
            let htmlString = `<!DOCTYPE html>
            <html lang="en">
            <head>
            </head>
            <body>
            <img alt="lorem ipsum">
            <p></p>
            <strong>
            </strong>

            <strong>
            </strong>
            </body>`;
            domParser = dom.parseFromString(htmlString);
        });
        it('Check invalid <strong> tag detection', () => {
            expect(function() {
                detectTagsWithoutAttribs();
                detectTagsWithoutAttribs(null, true);
            }).to.throw(Error);
        });
        it('Check <strong> tag exceeds limit', () => {
            const strongsTag = getTag(domParser)('strong');
            expect(detectCountTagExccedLimit(strongsTag, 1)).to.be.a('string');
            expect(detectCountTagExccedLimit(strongsTag, 2)).to.be.an('undefined');
        });
    });

    describe('Should able to detect meta tags', () => {
        let domParser;
        before(function() {
            let htmlString = `<!DOCTYPE html>
            <html lang="en">
            <head>
            <meta name="keywords" />
            <meta name="robots" />
            </head>
            <body>
            <img alt="lorem ipsum">
            <p></p>
            <strong>
            </strong>
            </body>`;
            domParser = dom.parseFromString(htmlString);
        });
        it('Check invalid <meta> tag detection', () => {
            expect(function() {
                detectMetaTags();
                detectMetaTags([], false);
            }).to.throw(Error);
        });
        it('Check <strong> tag exceeds limit', () => {
            const headTag = getTag(domParser)('head');
            const headNode = head(headTag)
            const metaTags = getTag(headNode)('meta');
            //console.log(detectMetaTags(metaTags, ['description']));
            expect(
                detectMetaTags(metaTags, ['description'])
            ).to.be.an('array').has.length(1);
            expect(
                detectMetaTags(metaTags, ['description', 'keywords'])
            ).to.be.an('array').has.length(2);
            expect(
                detectMetaTags(metaTags, ['description', 'keywords', 'robots'])
            ).to.be.an('array').has.length(3);
        });
    });
});
