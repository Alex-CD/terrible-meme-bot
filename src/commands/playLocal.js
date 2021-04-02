const fs = require('fs')
const random = require('random')
const util = require('util')

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

    if (!await this.guildHasAudioDir(this.audioDir, request.guildID)) {
      console.log('creating new audio dir for guild ' + request.guildID)
      await this.createAudioDir(this.audioDir, request.guildID)
    }

    console.log(this.audioFiles)
    const requestedFiles = this.audioFiles.get(request.guildID).get(request.content)

    if (!requestedFiles) {
      request.reply('Unknown audio clip')
      return
    }

    const player = this.players.get(request.guildID)
    const toPlay = this.audioDir + request.guildID + '/' + request.content + '/' + requestedFiles[random.int(0, requestedFiles.length - 1)]

    request.deleteMessage()

    if (player.isPlaying) {
      await player.interrupt(request, toPlay, 'LOCAL')
    } else {
      await player.play(request, toPlay, 'LOCAL')
    }
  }

  loadAudioFilesSync (audioDir) {
    // maps guild ids to maps of audio file names
    const guildSounds = new Map()
    const guilds = fs.readdirSync(audioDir)

    // audio dir contains a dir per guild,
    // which contains a dir per !v command,
    // which contains the audio files

    // iterating through guilds
    for (let g = 0; g < guilds.length; g++) {
      const thisGuildPath = audioDir + guilds[g]
      const thisGuildCommands = fs.readdirSync(thisGuildPath)

      const thisGuildSounds = new Map()
      // iterating through each guild's commands
      for (let c = 0; c < thisGuildCommands.length; c++) {
        const audioFiles = fs.readdirSync(thisGuildPath + '/' + thisGuildCommands[c])
        thisGuildSounds.set(thisGuildCommands[c], audioFiles)
      }

      guildSounds.set(guilds[g], thisGuildSounds)
    }

    return guildSounds
  }

  async loadAudioFilesAsync (audioDir) {
    try {
      // maps guild ids to maps of audio file names
      const guildSounds = new Map()
      const guilds = await fs.promises.readdir(audioDir)

      // audio dir contains a dir per guild,
      // which contains a dir per !v command,
      // which contains the audio files

      // iterating through guilds
      for (let g = 0; g < guilds.length; g++) {
        const thisGuildPath = audioDir + guilds[g]
        const thisGuildCommands = await fs.promises.readdir(thisGuildPath)

        const thisGuildSounds = new Map()
        // iterating through each guild's commands
        for (let c = 0; c < thisGuildCommands.length; c++) {
          const audioFiles = await fs.promises.readdir(thisGuildPath + '/' + thisGuildCommands[c])
          thisGuildSounds.set(thisGuildCommands[c], audioFiles)
        }

        guildSounds.set(guilds[g], thisGuildSounds)
      }

      return guildSounds
    } catch (error) {
      console.log('ERORR: LocalScan - ' + error)
    }
  }

  async guildHasAudioDir (audioDir, guildID) {
    try {
      await fs.promises.access(audioDir + guildID)
      return true
    } catch (error) {
      return false
    }
  }

  async createAudioDir (audioDir, guildID) {
    try {
      await util.promisify(fs.mkdir)(audioDir + guildID + '/')
    } catch (error) {
      console.log('failed to create new audio dir for guild ' + error)
    }
  }

  printCommands (request) {
    let out = '```Use !v [sound] to play a sound.\nAvailable commands: '

    const keys = this.audioFiles.keys()

    let key = keys.next()

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
