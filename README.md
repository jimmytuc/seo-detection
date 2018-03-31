[![Build Status](https://travis-ci.org/jimmytuc/seo-detection.svg?branch=master)](https://travis-ci.org/jimmytuc/seo-detection)

# Purpose
This package is for people who want to scan a HTML file and show all of the SEO defects.
Write with BabelJs ES6 syntax - have compatibility with all node versions.
Thanks to es6-module-boilerplate.

# Compatible node version
This package uses Node version 6. Supported `node` version can be defined in `.babelrc`. 

# Features
* Build with [Babel](https://babeljs.io). (ES6 -> ES5)
* Test with [mocha](https://mochajs.org).

# Installation
- `npm install --save seo-detection`

# Run tests
- `npm run test`
- `npm run test:watch`

# Run examples
- `npm run test:examples`

# Usage
## Basic
```
var sd = require('seo-detection')
var detection = new sd.Detection;
```
Set input
```
var readPath = path.join(__dirname, '/path/to/index.html');
detection.fromFile(readPath)
```
You can indicate type of output: `file` or `console`
```
var writePath = path.join(__dirname, '/path/to/output.txt')
detection.toFile(writePath)
```
Then run `detection.run()`
Please note that we can use chain functions also.
```
detection.fromFile(readPath).toFile(writePath).run()
```

## Input/Output Manipulation
- `fromFile(readInputPath: String)`
- `toFile(writeOutputPath: String)`

## Customize Meta Tag
### Constructor
Overwrite the default options. For i.g: `allowedMetaTagRules` defaults `['description', 'keywords']`
```
new Detection({
    allowedMetaTagRules: ['description', 'keywords', 'robots']
})
```
### Method
`setMetaTagRules(newRules: String|Array<String>)`
```
var dIns = new Detection;
dIns.setMetaTagRules('cache-expire')
```
Or
```
var dIns = new Detection;
dIns.setMetaTagRules(['cache-expire', 'robots'])
```

Please look at `examples` folder for more details.

# Changelogs
- `1.0.0` Class Detection, Input helpers, SEO detection methods, write tests for main features.
- `1.0.1` Enhance detection features, modify `fromFile`, `toFile`. Added test cases on this.
- `1.0.2` Write README.md, added `examples` for details usage.

# Enhancements
- Add `eslint` standard to validate syntax.
- Deploy to Travis CI