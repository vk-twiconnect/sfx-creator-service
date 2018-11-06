const assert = require('assert')

describe('lambda handler', function() {
    it('handler shouldn`t be undefined', function(done) {
        const handler = require('../lambda')
        assert.notEqual(handler.handler,undefined)
        done()
    })
})