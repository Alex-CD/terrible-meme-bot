var assert = require('chai').assert
var describe = require('mocha').describe
var it = require('mocha').it
var beforeEach = require('mocha').beforeEach

var util = require('util')

const Player = require('../src/player')
const MessageStub = require('./stubs/message_stub')

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

      var message = new MessageStub()

      await player.waitToDisconnect(message)
      await util.promisify(setTimeout)(1500)

      assert(message.voiceChannel == null, 'The bot\'s channel should have been set to null')
    })

    it('should not disconnect the bot if lastPlay is changed', async function () {
      player.idleDisconnectDelayMS = 100

      var message = new MessageStub()
      await player.waitToDisconnect(message)
      player.lastFinishTime = Date.now()
      await util.promisify(setTimeout)(100)

      assert(message.state.voiceChannel === '000', 'The bot\'s channel should have been left unchanged')
    })
  })
})
