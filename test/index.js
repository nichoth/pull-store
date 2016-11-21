var test = require('tape')
var S = require('pull-stream')
var Store = require('../')

var store = Store(function (acc, n) {
    return n
}, 0)

test('store', function (t) {
    t.plan(1)
    var expected = [0,1,2,3]
    S(
        S.values([1,2,3]),
        store(),
        S.collect(function (err, res) {
            t.deepEqual(res, expected, 'should emit initial state')
        })
    )
})

test('subscribe again', function (t) {
    t.plan(1)
    var expected = [3,4,5]
    S(
        S.values([4,5]),
        store(),
        S.collect(function (err, res) {
            t.deepEqual(res, expected, 'should keep state after a stream ends')
        })
    )
})
