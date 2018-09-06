var test = require('tape')
var fs = require('fs')
var path = require('path')
var concat = require('simple-concat')
var fromBuffer = require('from2-buffer')
var inflateRaw = require('..')
var inflateRawStream = require('../stream')
var input = fs.readFileSync(path.join(__dirname, 'test.deflate'))
var expected = fs.readFileSync(path.join(__dirname, 'expected.txt'), 'utf8')

test('callback', function (t) {
  inflateRaw(input, function (err, data) {
    t.ifError(err)
    t.equal(data.toString('utf8'), expected)
    t.end()
  })
})

test('stream', function (t) {
  concat(
    fromBuffer(input)
      .pipe(inflateRawStream()),
    function (err, data) {
      t.ifError(err)
      t.equal(data.toString('utf8'), expected)
      t.end()
    })
})
