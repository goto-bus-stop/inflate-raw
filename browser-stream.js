var Inflate = require('pako/lib/inflate').Inflate
var through = require('through2')

function InflateError (inflater) {
  Error.call(inflater.msg)
  this.code = inflater.err
}
InflateError.prototype = Object.create(Error.prototype)
InflateError.prototype.constructor = InflateError

module.exports = function createInflateRaw () {
  var inflater = Inflate({ raw: true })
  var stream = through(onwrite, onend)
  inflater.onData = function (chunk) {
    stream.push(chunk)
  }
  inflater.onEnd = function (status) {
    stream.push(null)
  }
  function onwrite (chunk, enc, cb) {
    inflater.push(chunk, false)
    if (inflater.err) return cb(new InflateError(inflater))
    cb()
  }
  function onend (cb) {
    inflater.push(new Uint8Array(0), true)
    if (inflater.err) return cb(new InflateError(inflater))
  }

  return stream
}
