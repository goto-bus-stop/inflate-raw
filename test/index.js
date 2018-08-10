var test = require('tape')
var fs = require('fs')
var path = require('path')
var concat = require('simple-concat')
var inflateRaw = require('..')
var inflateRawStream = require('../stream')
var inflateRawWorker = require('../worker')
var input = path.join(__dirname, 'test.deflate')
var expected = fs.readFileSync(path.join(__dirname, 'expected.txt'), 'utf8')

test('callback', function (t) {
  inflateRaw(fs.readFileSync(input), function (err, data) {
    t.ifError(err)
    t.equal(data.toString('utf8'), expected)
    t.end()
  })
})

test('stream', function (t) {
  concat(
    fs.createReadStream(input)
      .pipe(inflateRawStream()),
    function (err, data) {
      t.ifError(err)
      t.equal(data.toString('utf8'), expected)
      t.end()
    })
})

test('worker', function (t) {
  inflateRawWorker(fs.readFileSync(input), function (err, data) {
    t.ifError(err)
    t.equal(data.toString('utf8'), expected)
    t.end()
  })
})
