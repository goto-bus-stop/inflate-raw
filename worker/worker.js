var inflate = require('pako/lib/inflate').inflateRaw

self.onmessage = function (ev) {
  try {
    self.postMessage({ uncompressed: inflate(ev.data) })
  } catch (err) {
    self.postMessage({ error: err })
  }
}
