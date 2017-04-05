var S = require('pull-stream/pull')
S.through = require('pull-stream/throughs/through')
S.once = require('pull-stream/sources/once')
var scan = require('pull-scan')
var cat = require('pull-cat')
var Notify = require('pull-notify')

function State (reducer, init) {
    var state = init
    var notify = Notify()

    function stateStream () {
        var transform = S(
            scan(reducer, state),
            S.through(function (newState) {
                state = newState
                notify(state)
            })
        )

        // return a stream that immediately emits the last state
        return function sink (source) {
            var live = S(source, transform)
            return cat([S.once(state), live])
        }
    }

    stateStream.state = function () {
        return cat([ S.once(state), notify.listen() ])
    }

    stateStream.end = notify.end

    return stateStream
}

module.exports = State
