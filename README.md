# inflate-raw

decompress a raw DEFLATE buffer or stream in node and the browser

It uses a subset of [pako](https://npmjs.com/package/pako) in the browser which is smaller than using the zlib-browserify module.

[Install](#install) - [Usage](#usage) - [License: Apache-2.0](#license)

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/inflate-raw.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/inflate-raw
[travis-image]: https://img.shields.io/travis/goto-bus-stop/inflate-raw.svg?style=flat-square
[travis-url]: https://travis-ci.org/goto-bus-stop/inflate-raw
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard

## Install

```
npm install inflate-raw
```

## Usage

```js
var inflateRaw = require('inflate-raw')
inflateRaw(compressedBuffer, function (err, uncompressedBuffer) {
})

var inflateRawStream = require('inflate-raw/stream')
someCompressedStream
  .pipe(inflateRawStream())
  .pipe(elsewhere)

var inflateRawWorker = require('inflate-raw/worker')
inflateRawWorker(compressedBuffer, function (err, uncompressedBuffer) {
})
```

In the browser, the main `inflate-raw` entry point is blocking, so if you inflate a very large buffer the browser may hang. You can use `inflate-raw/worker` instead which has the same API, but offloads the inflating to a Web Worker. Note that you _cannot_ use `compressedBuffer` while inflation is in progress, because it is moved into the worker rather than copied. If you need to use the `compressedBuffer`, manually copy it first. After inflation, the `compressedBuffer` is moved back to the main thread, so you can use it again.

The `inflate-raw/stream` API is also synchronous but if the data comes streaming in in small chunks it will not noticeably lag the browser. It exposes a node-style stream transform interface.

## License

[Apache-2.0](LICENSE.md)
