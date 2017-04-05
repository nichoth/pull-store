var test = require('tape')
var S = require('pull-stream')
var Store = require('../')

var store = Store(function (acc, n) {
    return n
}, 0)

test('store', function (t) {
    t.plan(2)
    S(
        S.values([1,2,3]),
        store(),
        S.collect(function (err, res) {
            t.error(err)
            t.deepEqual(res, [0,1,2,3], 'should emit initial state')
        })
    )
})

test('subscribe again', function (t) {
    t.plan(2)

    S(
        S.values([4,5]),
        store(),
        S.collect(function (err, res) {
            t.error(err)
            t.deepEqual(res, [3,4,5],
                'should keep state after a stream ends')
        })
    )
})

test('multiple subscribers', function (t) {
    t.plan(4)

    S(
        store.state(),
        S.collect(function (err, res) {
            t.error(err)
            t.deepEqual(res, [5,6,7,8], 'we can listen over here too')
        })
    )

    S(
        S.values([6,7,8]),
        store(),
        S.collect(function (err, res) {
            t.error(err)
            t.deepEqual(res, [5,6,7,8])
        })
    )

    store.end()
})

