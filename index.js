var S = require('pull-stream/pull')
S.through = require('pull-stream/throughs/through')
var scan = require('pull-scan')
var cat = require('pull-cat')

function State (reducer, init) {
    var state = init

    return function stateStream () {
        var transform = S(
            scan(reducer, state),
            S.through(function (newState) {
                state = newState
            })
        )

        // return a stream that immediately emits the last state
        return function sink (source) {
            var live = S(source, transform)
            return cat([S.once(state), live])
        }
    }
}

module.exports = State
