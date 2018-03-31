'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Detection = undefined;

var _domParser = require('dom-parser');

var _domParser2 = _interopRequireDefault(_domParser);

var _ramda = require('ramda');

var _seo = require('./seo');

var _output = require('./output');

var _input = require('./input');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_CONFIG = Object.freeze({
    allowedStrongTag: 15,
    output: 'console',
    writeTo: false,
    allowedMetaTagRules: ['description', 'keywords']
});

class Detection {
    /**
     * 
     * @param {object} newConfig not required
     * @param {string} path not required
     */
    constructor(newConfig, inputPath) {
        this.config = Object.assign({}, DEFAULT_CONFIG);
        // overwrite
        if (newConfig) {
            for (let c in newConfig) {
                if (this.config.hasOwnProperty(c)) {
                    this.config[c] = newConfig[c];
                }
            }
        }

        this.readPath = inputPath ? inputPath : null;
        this.metaRules = this.config.allowedMetaTagRules instanceof Array && this.config.allowedMetaTagRules.length > 0 ? this.config.allowedMetaTagRules : DEFAULT_CONFIG.allowedMetaTagRules;
        this.output = (0, _output.write)(this.config.output);
        if (this.config.writeTo && this.config.writeTo != '') {
            this.writePath = this.config.writeTo;
        }
    }

    /**
     * expand meta tag rules. By default description & keywords included
     * @param {Array<String>} rules
     * @return Parse 
     */
    setMetaTagRules(rules) {
        if (Array.isArray(rules)) {
            (0, _ramda.forEach)(item => {
                this.metaRules.push(item);
            }, rules);
        } else if (typeof rules === 'string' && rules !== '') {
            this.metaRules.push(rules);
        }
        this.metaRules = (0, _ramda.uniq)(this.metaRules);
        return this;
    }

    /**
     * 
     * @param {string} path
     * @return Parse
     */
    fromFile(path) {
        this.readPath = path;
        return this;
    }

    /**
     * 
     * @param {string} path
     * @return {Parse}
     */
    toFile(path) {
        this.writePath = path;
        return this;
    }

    /**
     * parse dom data from string
     * @param {String} data file content 
     * @return Array<String>
     */
    parseString(data) {
        if (typeof data === undefined || !data) {
            throw new Error('Cannot specify string input');
        }
        const dom = new _domParser2.default().parseFromString(data);
        const tag = (0, _ramda.curry)((domParser, tagName) => {
            return domParser.getElementsByTagName(tagName);
        });
        const getTag = tag(dom);

        let titleTag = 'title',
            h1Tag = 'h1',
            limit1Tag = 1;

        const headTag = getTag('head');
        const imgsTag = getTag('img');
        const asTag = getTag('a');
        const strongsTag = getTag('strong');

        const headNode = (0, _ramda.head)(headTag);
        const getTagHead = tag(headNode);

        let errorMessages = [];
        errorMessages.push((0, _seo.detectMetaTags)(getTagHead('meta'), this.metaRules));
        errorMessages.push((0, _seo.detectRequiredTags)(getTagHead(titleTag), limit1Tag, titleTag));
        errorMessages.push((0, _seo.detectRequiredTags)(getTag(h1Tag), limit1Tag, h1Tag));
        errorMessages.push((0, _seo.detectTagsWithoutAttribs)(imgsTag, 'alt'));
        errorMessages.push((0, _seo.detectTagsWithoutAttribs)(asTag, 'rel'));
        errorMessages.push((0, _seo.detectCountTagExccedLimit)(strongsTag, this.config.allowedStrongTag));
        return errorMessages;
    }

    /**
     * alert to file|console
     * @param {Array<String>} errorMessages 
     * @return void
     */
    alert(errorMessages) {
        this.output(errorMessages);
    }

    /**
     * run whole process
     * @return Promise
     */
    run() {
        if (typeof this.readPath === undefined || this.readPath === null) {
            throw new Error('Cannot specify file input');
        }
        if (this.config.output === 'file') {
            if (!this.writePath || this.writePath == '') {
                throw new Error('Please specify the writeTo option or set toFile(outputPath) method');
            }
            this.output = (0, _output.write)('file')(this.writePath);
        }
        return (0, _input.read)(this.readPath).then(data => this.parseString(data)).then(message => this.alert(message)).catch(err => {
            throw new Error(err);
        });
    }
}
exports.Detection = Detection;