var Inflate = require('pako/lib/inflate').Inflate
var Transform = require('stream').Transform

function InflateError (inflater) {
  Error.call(inflater.msg)
  this.code = inflater.err
}
InflateError.prototype = Object.create(Error.prototype)
InflateError.prototype.constructor = InflateError

module.exports = function createInflateRaw () {
  var inflater = Inflate({ raw: true })
  var stream = new Transform()
  inflater.onData = function (chunk) {
    stream.push(chunk)
  }
  inflater.onEnd = function (status) {
    stream.push(null)
  }
  stream._transform = function (chunk, enc, cb) {
    inflater.push(chunk, false)
    if (inflater.err) return cb(new InflateError(inflater))
    cb()
  }
  stream._flush = function (cb) {
    inflater.push(new Uint8Array(0), true)
    if (inflater.err) return cb(new InflateError(inflater))
  }

  return stream
}
