var inflateRaw = require('pako/lib/inflate').inflateRaw

module.exports = function (buffer, cb) {
  process.nextTick(function () {
    try { cb(null, inflateRaw(buffer)) }
    catch (err) { cb(err) }
  })
}
