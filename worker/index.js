/* eslint-env browser */
var fs = require('fs')

var text = fs.readFileSync(require.resolve('./bundle'), 'base64')
var worker = new Worker('data:application/javascript;base64,' + text)
var errored = false
var callbacks = []

worker.onmessage = function (ev) {
  var cb = callbacks.shift()
  if (ev.data.error) {
    cb(ev.data.error)
  } else {
    var buffer = ev.data.uncompressed
    cb(null, Buffer.from(buffer))
  }
}

worker.onerror = function () {
  var cb
  while ((cb = callbacks.shift())) {
    cb(new Error('Worker failed to start'))
  }
  errored = true
}

module.exports = function (data, cb) {
  if (errored) {
    process.nextTick(function () {
      cb(new Error('Worker failed to start'))
    })
  }

  if (!(data instanceof ArrayBuffer)) {
    if (data && data.buffer instanceof ArrayBuffer) {
      data = data.buffer
    } else {
      process.nextTick(function () {
        cb(new Error('inflate-raw: must provide a Buffer or Uint8Array'))
      })
      return
    }
  }

  callbacks.push(cb)
  try {
    worker.postMessage(data, [data])
  } catch (err) {
    process.nextTick(function () { cb(err) })
  }
}
