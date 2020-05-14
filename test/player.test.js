var assert = require('chai').assert
var describe = require('mocha').describe
var it = require('mocha').it
var beforeEach = require('mocha').beforeEach

var util = require('util')

const Player = require('../src/player')
const RequestStub = require('./stubs/request_stub')

describe('player', function () {
  var player

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

      var request = new RequestStub({ isConnected: true })

      await player.waitToDisconnect(request)
      await util.promisify(setTimeout)(1500)

      assert(!request.state.isConnected, 'The bot\'s channel should have been set to null')
    })

    it('should not disconnect the bot if lastPlay is changed', async function () {
      player.idleDisconnectDelayMS = 100

      var request = new RequestStub({ isConnected: true })
      await player.waitToDisconnect(request)
      player.lastFinishTime = Date.now()
      await util.promisify(setTimeout)(200)
      assert(request.state.isConnected, 'The bot should not have been disconnected')
    })

    it('should not disconnect if isplaying is changed', async function () {
      player.idleDisconnectDelayMS = 100

      var request = new RequestStub({ isConnected: true })
      await player.waitToDisconnect(request)
      player.isPlaying = true
      await util.promisify(setTimeout)(200)
      assert(request.state.isConnected, 'The bot should not have been disconnected')
    })
  })
})
