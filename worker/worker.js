/* eslint-env worker */
var inflate = require('pako/lib/inflate').inflateRaw

self.addEventListener('message', function (ev) {
  try {
    var uncompressed = inflate(ev.data).buffer
    self.postMessage({ uncompressed: uncompressed }, [ev.data, uncompressed])
  } catch (err) {
    self.postMessage({ error: err })
  }
})
