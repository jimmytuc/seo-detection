import DomParser from 'dom-parser';
import {
    head,
    forEach,
    uniq,
    curry
} from 'ramda';
import {
    detectMetaTags,
    detectRequiredTags,
    detectTagsWithoutAttribs,
    detectCountTagExccedLimit
} from './seo';
import { write } from './output';
import { read } from './input';

const DEFAULT_CONFIG = Object.freeze({
    allowedStrongTag: 15,
    output: 'console',
    writeTo: false,
    allowedMetaTagRules: ['description','keywords']
});

export class Detection {
    /**
     * 
     * @param {object} newConfig not required
     * @param {string} path not required
     */
    constructor(newConfig, inputPath) {
        this.config = Object.assign({}, DEFAULT_CONFIG);
        // overwrite
        if(newConfig) {
            for(let c in newConfig) {
                if(this.config.hasOwnProperty(c)) {
                    this.config[c] = newConfig[c];
                }
            }
        }
        
        this.readPath = inputPath ? inputPath: null;
        this.metaRules = ((this.config.allowedMetaTagRules instanceof Array) 
                            && (this.config.allowedMetaTagRules.length > 0)) 
            ? this.config.allowedMetaTagRules : DEFAULT_CONFIG.allowedMetaTagRules;
        this.output = write(this.config.output);
        if(this.config.writeTo && this.config.writeTo != '') {
            this.writePath = this.config.writeTo;
        }
    }

    /**
     * expand meta tag rules. By default description & keywords included
     * @param {Array<String>} rules
     * @return Parse 
     */
    setMetaTagRules(rules) {
        if(Array.isArray(rules)) {
            forEach((item) => {
                this.metaRules.push(item);
            }, rules);
        } else if(typeof rules === 'string' && rules !== '') {
            this.metaRules.push(rules);
        }
        this.metaRules = uniq(this.metaRules);
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
        if(typeof data === undefined || !data) {
            throw new Error('Cannot specify string input');
        }
        const dom = (new DomParser()).parseFromString(data);
        const tag = curry((domParser, tagName) => {
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

        const headNode = head(headTag)
        const getTagHead = tag(headNode);

        let errorMessages = [];
        errorMessages.push(
            detectMetaTags(getTagHead('meta'), this.metaRules)
        );
        errorMessages.push(
            detectRequiredTags(getTagHead(titleTag), limit1Tag, titleTag)
        );
        errorMessages.push(
            detectRequiredTags(getTag(h1Tag), limit1Tag, h1Tag)
        );
        errorMessages.push(
            detectTagsWithoutAttribs(imgsTag, 'alt')
        );
        errorMessages.push(
            detectTagsWithoutAttribs(asTag, 'rel')
        );
        errorMessages.push(
            detectCountTagExccedLimit(strongsTag, this.config.allowedStrongTag)
        );
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
        if(typeof this.readPath === undefined || this.readPath === null) {
            throw new Error('Cannot specify file input');
        }
        if(this.config.output === 'file') {
            if(!this.writePath || this.writePath == '') {
                throw new Error('Please specify the writeTo option or set toFile(outputPath) method');
            }
            this.output = write('file')(this.writePath);
        }
        return read(this.readPath)
            .then(data => this.parseString(data))
            .then(message => this.alert(message))
            .catch(err => {
                throw new Error(err)
            });
    }
}