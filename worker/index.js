var fs = require('fs')

var text = fs.readFileSync(require.resolve('./bundle'), 'utf8')
var worker = new Worker('data:application/javascript;' + text)
var callbacks = []
worker.onmessage = function (ev) {
  var cb = callbacks.shift()
  cb(ev.data.error, ev.data.uncompressed)
}

module.exports = function (data, cb) {
  if (!(data instanceof ArrayBuffer)) {
    if (data && data.buffer instanceof ArrayBuffer) {
      data = data.buffer
    } else {
      return process.nextTick(function () {
        cb(new Error('inflate-raw: must provide a Buffer or Uint8Array'))
      })
    }
  }

  callbacks.push(cb)
  worker.postMessage(data)
}
