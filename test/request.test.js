const assert = require('chai').assert
const describe = require('mocha').describe
const it = require('mocha').it

const MessageStub = require('./stubs/message_stub')

const Request = require('../src/request')

describe('request', function () {
  describe('#removeSpaces', function () {
    const request = new Request(new MessageStub())

    it('should remove leading spaces', function () {
      assert(request.trimSpaces(' Hi World') === 'Hi World', 'leading spaces should have been removed')
    })

    it('should remove trailing spaces', function () {
      assert(request.trimSpaces('Hi World   ') === 'Hi World', 'trailing spaces should have been removed')
    })

    it('should remove extra spaces within a message', function () {
      assert(request.trimSpaces('Hi   World') === 'Hi World', 'extra spaces should have been removed')
    })

    it('should leave a string with no extra spaces unchanged', function () {
      assert(request.trimSpaces('Hi World this is a test') === 'Hi World this is a test')
    })
  })

  describe('#trimCommand', function () {
    const request = new Request(new MessageStub())

    it('should remove the command from a string, leaving the arguments', function () {
      assert(request.trimCommand('!test hiworld') === 'hiworld', 'removed the prefix (\'!example\') from the message')
    })

    it('should be able to tolerate empty strings', function () {
      assert(request.trimCommand('') === '', 'return empty string without erroring')
    })
  })
})
