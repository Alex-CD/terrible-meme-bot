const fs = require('fs')
const util = require('util')

const random = require('random')
const bot = require('../bot_utils')

class PlayLocal {
  constructor (settings, players) {
    this.players = players
    this.aliases = ['v']
    this.audioDir = process.env.LOCAL_AUDIO_DIR + '/'
    this.audioFiles = this.loadAudioFilesSync(this.audioDir)
  }

  async run (command, message) {
    if (command === 'help') {
      this.printCommands(message)
      return
    }

    if (command === 'rescan') {
      this.audioFiles = await this.loadAudioFilesAsync(this.audioDir)
      await message.channel.send('Audio files reloaded.')
      return
    }

    if (!bot.isUserConnected(message)) {
      message.channel.send('You need to be in a voice channel to play audio')
      return
    }

    var requestedFiles = this.audioFiles.get(command)

    if (!requestedFiles) {
      message.channel.send('Unknown audio clip')
      return
    }

    var player = this.players.get(message.guild.id)
    var toPlay = this.audioDir + command + '/' + requestedFiles[random.int(0, requestedFiles.length - 1)]

    message.delete()

    if (player.isPlaying) {
      await player.interrupt(message, toPlay, 'LOCAL')
    } else {
      await player.play(message, toPlay, 'LOCAL')
    }
  }

  loadAudioFilesSync (audioDir) {
    var newFiles = new Map()

    var directories = fs.readdirSync(audioDir)
    for (var i = 0; i < directories.length; i++) {
      var files = fs.readdirSync(audioDir + directories[i])
      newFiles.set(directories[i], files)
    }

    return newFiles
  }

  loadAudioFilesAsync (audioDir) {
    var newFiles = new Map()

    var directories = util.promisify(fs.readdirSync)(audioDir)
    for (var i = 0; i < directories.length; i++) {
      var files = util.promisify(fs.readdirSync)(audioDir + directories[i])
      newFiles.set(directories[i], files)
    }

    return newFiles
  }

  printCommands (message) {
    var out = '```Use !v [sound] to play a sound.\nAvailable commands: '

    var keys = this.audioFiles.keys()

    var key = keys.next()

    while (!key.done) {
      out += key.value
      key = keys.next()

      if (!key.done) out += ', '
    }

    out += '```'

    message.channel.send(out)
  }
}

module.exports = PlayLocal
