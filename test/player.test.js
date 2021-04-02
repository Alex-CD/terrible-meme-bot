const assert = require('chai').assert
const describe = require('mocha').describe
const it = require('mocha').it
const beforeEach = require('mocha').beforeEach

const util = require('util')
const Player = require('../src/player')
const RequestStub = require('./stubs/request_stub')

describe('player', function () {
  let player

  beforeEach(function () {
    player = new Player()
  })

  describe('#playNext', function () {

  })

  describe('#pause', function () {

  })

  describe('#play', function () {

  })

  describe('#waitToLeave', function () {
    it('should disconnect the bot if the bot waits for long enough', async function () {
      player.idleDisconnectDelayMS = 30

      const request = new RequestStub({ isConnected: true })

      await player.waitToDisconnect(request)
      await util.promisify(setTimeout)(1500)

      assert(!request.state.isConnected, 'The bot\'s channel should have been set to null')
    })

    it('should not disconnect the bot if lastPlay is changed', async function () {
      player.idleDisconnectDelayMS = 100

      const request = new RequestStub({ isConnected: true })
      await player.waitToDisconnect(request)
      player.lastFinishTime = Date.now()
      await util.promisify(setTimeout)(200)
      assert(request.state.isConnected, 'The bot should not have been disconnected')
    })

    it('should not disconnect if isplaying is changed', async function () {
      player.idleDisconnectDelayMS = 100

      const request = new RequestStub({ isConnected: true })
      await player.waitToDisconnect(request)
      player.isPlaying = true
      await util.promisify(setTimeout)(200)
      assert(request.state.isConnected, 'The bot should not have been disconnected')
    })
  })
})
