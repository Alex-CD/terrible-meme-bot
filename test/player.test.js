var assert = require('chai').assert
var describe = require('mocha').describe
var it = require('mocha').it
var beforeEach = require('mocha').beforeEach

var util = require('util')
const ytdl = require('ytdl-core')
const fs = require('fs')
const path = require('path')

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

    // REGRESSION TESTS

    it('should play videos ', async function () {
      var testFilePath = path.join(__dirname, '/testVideo.mp3')
      // Deleting test file if it exists
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath)
      }
      try {
        ytdl('https://www.youtube.com/watch?v=AXrHbrMrun0', { filter: 'audioonly', quality: 'lowestaudio' }).pipe(fs.createWriteStream(testFilePath))
      } catch (e) {
        assert.fail('An exception was thrown.')
      } finally {
        if (fs.existsSync(testFilePath)) {
          fs.unlinkSync(testFilePath)
        }
      }

      assert(fs.existsSync(testFilePath), 'The audio file should have been downloaded')
    })
  })
})
