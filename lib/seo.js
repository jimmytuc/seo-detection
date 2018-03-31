'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.detectMetaTags = detectMetaTags;
exports.detectTagsWithoutAttribs = detectTagsWithoutAttribs;
exports.detectCountTagExccedLimit = detectCountTagExccedLimit;
exports.detectRequiredTags = detectRequiredTags;

var _ramda = require('ramda');

/**
 * 
 * @param {Array<Node>} tags 
 * @return {Array<String>}
 */
function detectMetaTags(tags, metaRules) {
    if (tags instanceof Array === false) {
        throw new Error('Invalid tags parameter.');
    }
    if (metaRules instanceof Array === false) {
        throw new Error('Invalid metaRules parameter.');
    }

    let filterNotFoundName = (0, _ramda.filter)(rule => (0, _ramda.indexOf)(rule, tags.map(item => item.getAttribute('name'))) == -1, metaRules);

    let getTagsFoundName = (0, _ramda.filter)(tag => (0, _ramda.indexOf)(tag.getAttribute('name'), metaRules) > -1, tags);

    let filterNotFoundContent = (0, _ramda.filter)(tag => {
        let content = tag.getAttribute('content');
        return typeof content === 'undefined' || !content;
    }, getTagsFoundName);
    return (0, _ramda.concat)((0, _ramda.map)(item => `Not found meta ${item} in this HTML`, filterNotFoundName), (0, _ramda.map)(item => `Meta ${item.getAttribute('name')} missing content in this HTML`, filterNotFoundContent));
}

/**
 * 
 * @param {Array<Node>} tags 
 * @param {String} attribute 
 * @return {Array<String>}
 */
function detectTagsWithoutAttribs(tags, attribute) {
    if (tags instanceof Array === false) {
        throw new Error('Invalid tags parameter.');
    }
    if (typeof attribute !== 'string') {
        throw new Error('Attribute must be a string.');
    }
    let count = 0;
    let messages = [];
    tags.forEach(tagNode => {
        if (!tagNode.getAttribute(attribute) || typeof tagNode.getAttribute(attribute) !== 'string') {
            messages.push(`There are ${++count} <${tagNode.nodeName}> without ${attribute} attribute`);
        }
    });
    return messages;
}

/**
 * 
 * @param {Array} tags 
 * @param {Number} limit 
 * @return {String}
 */
function detectCountTagExccedLimit(tags, limit) {
    if (tags instanceof Array === false) {
        throw new Error('Invalid tags parameter.');
    }
    if (typeof limit !== 'number') {
        throw new Error('Limit must be a number.');
    }
    if (tags.length > limit) {
        const theFistTag = (0, _ramda.head)(tags);
        return `<${theFistTag.nodeName}> should not be more than ${limit} time(s) in the HTML.`;
    }
}

/**
 * 
 * @param {Array} tags 
 * @param {Number} limit 
 * @param {String} tagType
 * @return {String|Undefined}
 */
function detectRequiredTags(tags, limit, tagType) {
    if (tags instanceof Array === false || !tags) {
        throw new Error('Invalid tags parameter.');
    }
    if (typeof limit !== 'number') {
        throw new Error('Limit must be a number.');
    }
    if (tags.length == 0) {
        return `<${tagType}> should be used in the HTML`;
    } else if (tags.length > limit) {
        return `<${tagType}> should be used only ${limit} in the HTML`;
    }
}