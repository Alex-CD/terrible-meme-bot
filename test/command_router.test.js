const assert = require('chai').assert
const describe = require('mocha').describe
const it = require('mocha').it
const beforeEach = require('mocha').beforeEach
const Router = require('../src/command_router')

const CommandStub = require('./stubs/command_stub')
const RequestStub = require('./stubs/request_stub')
const PlayerManagerStub = require('./stubs/player_manager_stub')

describe('command_router', function () {
  let players

  beforeEach(function () {
    players = new PlayerManagerStub()
  })

  describe('#route', function () {
    it('should accept a command handler, and a text command', function () {
      const commands = { test: new CommandStub(['test']) }
      const router = new Router({ prefix: '!' }, players, commands)

      const request = new RequestStub({ text: '!test' })
      router.route(request)
      assert(commands.test.hasRun, 'the correct command should have run')
    })

    it('should identify and run the correct command handler', function () {
      const commands = { test1: new CommandStub(['test1']), test2: new CommandStub(['test2']) }

      const router = new Router({ prefix: '!' }, players, commands)

      router.route(new RequestStub({ text: '!test2' }))

      assert(commands.test2.hasRun, 'the correct command should have run')
      assert(!commands.test1.hasRun, 'the incorrect command should not have run')
    })

    it('should reject commands without a prefix', function () {
      const commands = { test1: new CommandStub(['test']) }
      const router = new Router({ prefix: '!' }, players, commands)
      router.route(new RequestStub({ text: 'REEEE  text has no prefix' }))
      assert(!commands.test1.hasRun, 'the command should have not run')
    })

    it('should reject commands from a bot, or that are a PM', function () {
    })
  })
})
