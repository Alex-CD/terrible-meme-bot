var assert = require('chai').assert
var describe = require('mocha').describe
var it = require('mocha').it
var beforeEach = require('mocha').beforeEach
const Router = require('../src/command_router')

const CommandStub = require('./stubs/command_stub')
const RequestStub = require('./stubs/request_stub')
const PlayerManagerStub = require('./stubs/player_manager_stub')

describe('command_router', function () {
  var players

  beforeEach(function () {
    players = new PlayerManagerStub()
  })

  describe('#route', function () {
    it('should accept a command handler, and a text command', function () {
      var commands = { test: new CommandStub(['test']) }
      var router = new Router({ prefix: '!' }, players, commands)

      var request = new RequestStub({ text: '!test' })
      router.route(request)
      assert(commands.test.hasRun, 'the correct command should have run')
    })

    it('should identify and run the correct command handler', function () {
      var commands = { test1: new CommandStub(['test1']), test2: new CommandStub(['test2']) }

      var router = new Router({ prefix: '!' }, players, commands)

      router.route(new RequestStub({ text: '!test2' }))

      assert(commands.test2.hasRun, 'the correct command should have run')
      assert(!commands.test1.hasRun, 'the incorrect command should not have run')
    })

    it('should reject commands without a prefix', function () {
      var commands = { test1: new CommandStub(['test']) }
      var router = new Router({ prefix: '!' }, players, commands)
      router.route(new RequestStub({ text: 'REEEE  text has no prefix' }))
      assert(!commands.test1.hasRun, 'the command should have not run')
    })

    it('should reject commands from a bot, or that are a PM', function () {
    })
  })
})
