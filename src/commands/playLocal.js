const fs = require('fs')
const random = require('random')

class PlayLocal {
  constructor (settings, players) {
    this.players = players
    this.aliases = ['v']
    this.audioDir = process.env.LOCAL_AUDIO_DIR + '/'
    this.audioFiles = this.loadAudioFilesSync(this.audioDir)
  }

  async run (request) {
    if (request.content === 'help') {
      this.printCommands(request)
      return
    }

    if (request.content === 'rescan') {
      this.audioFiles = await this.loadAudioFilesAsync(this.audioDir)
      await request.reply('Audio files reloaded.')
      return
    }

    if (!request.isAuthorConnected()) {
      request.reply('You need to be in a voice channel to play audio')
      return
    }

    var requestedFiles = this.audioFiles.get(request.content)

    if (!requestedFiles) {
      request.reply('Unknown audio clip')
      return
    }

    var player = this.players.get(request.guildID)
    var toPlay = this.audioDir + request.content + '/' + requestedFiles[random.int(0, requestedFiles.length - 1)]

    request.deleteMessage()

    if (player.isPlaying) {
      await player.interrupt(request, toPlay, 'LOCAL')
    } else {
      await player.play(request, toPlay, 'LOCAL')
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

  async loadAudioFilesAsync (audioDir) {
    try {
      var newFiles = new Map()
      var directories = await fs.promises.readdir(audioDir)
      for (var i = 0; i < directories.length; i++) {
        var files = await fs.promises.readdir(audioDir + directories[i])
        newFiles.set(directories[i], files)
      }

      return newFiles
    } catch (error) {
      console.log('ERORR: LocalScan - ' + error)
    }
  }

  printCommands (request) {
    var out = '```Use !v [sound] to play a sound.\nAvailable commands: '

    var keys = this.audioFiles.keys()

    var key = keys.next()

    while (!key.done) {
      out += key.value
      key = keys.next()

      if (!key.done) out += ', '
    }

    out += '```'

    request.reply(out)
  }
}

module.exports = PlayLocal
