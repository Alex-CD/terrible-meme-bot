var AudioQueue = require('./audio_queue')

const ytdl = require('ytdl-core')

class GuildPlayer {
  constructor (idleDisconnectDelayMinutes) {
    this.idleDisconnectDelayMS = idleDisconnectDelayMinutes * 60 * 1000
    this.audioQueue = new AudioQueue()

    this.lastFinishTime = Date.now()

    this.isPlaying = false
    this.isPaused = false

    this.volume = 0.5
    this.nowPlaying = { url: '', source: '' }
  }

  async play (request, url, source) {
    if (this.isPaused) {
      this.stop(request)
    }

    var videosQueued = await this.audioQueue.add(url, source)

    if (source === 'YOUTUBE') {
      switch (true) {
        case videosQueued === 0:
          request.reply('Error fetching playlist. Sorry! This is a bug with youtube.' +
            'Rerequesting the playlist usually works.')
          return
        case videosQueued === 1:
          request.reply('Song queued.')
          break
        case videosQueued > 1:
          request.reply('Enqueued ' + videosQueued + ' songs')
          break
        default:
          request.reply('Invalid video/playlist url')
          return
      }
    }

    if (!this.isPlaying) {
      var connection = await request.joinAuthorVoiceChannel()
      await this.playNext(request, connection)
    }
  }

  interrupt (request, url, source) {
    if (this.isPlaying && !this.isPaused) {
      // !v requeues non-local clips
      if (this.nowPlaying.source !== 'LOCAL') {
        this.audioQueue.jumpQueue(this.nowPlaying.url, this.nowPlaying.source)
      }

      this.audioQueue.jumpQueue(url, source)
      this.skip(request)
    } else {
      this.play(request, url, source)
    }
  }

  async pause (request) {
    try {
      if (this.isPlaying && !this.isPaused) {
        var connection = await this.getConnection(request)
        await connection.dispatcher.pause()

        this.isPaused = true
      }
    } catch (error) {
      console.log('ERROR: Pause - ' + error)
    }
  }

  async resume (request) {
    if (this.isPlaying && this.isPaused) {
      var connection = await this.getConnection(request)
      if (connection) {
        await connection.dispatcher.resume()

        this.isPaused = false
      }

      return
    }

    request.reply('Player is not paused.')
  }

  async getConnection (request) {
    var thisConnection = await request.message.client.voice.connections.filter((connection) => {
      return connection.channel.id === request.message.guild.me.voice.channel.id
    })
    return thisConnection.first()
  }

  async skip (request) {
    if (this.isPlaying || this.isPaused) {
      var connection = await this.getConnection(request)
      await connection.dispatcher.end()
    }
  }

  async stop (request) {
    this.audioQueue.clear()
    this.isPlaying = false
    this.isPaused = false

    var connection = await this.getConnection(request)
    if (connection.dispatcher) {
      await connection.dispatcher.end()
    }
  }

  async setVolume (request, volume) {
    if (!Number.isInteger(volume) || volume < 0 || volume > 9999) return

    this.volume = volume / 100.0

    try {
      var connection = await this.getConnection(request)
      if (connection.dispatcher !== undefined) {
        await connection.dispatcher.setVolume(this.volume)
      }
    } catch (error) {
      console.log('ERROR: volume - ' + error)
    }
  }

  async playNext (request, connection) {
    if (this.audioQueue.isEmpty()) {
      this.isPlaying = false
      this.isPaused = false
      this.waitToDisconnect(request)
      return
    }
    var toPlay = this.audioQueue.get()

    this.nowPlaying.url = toPlay.url
    this.nowPlaying.source = toPlay.source

    this.isPlaying = true
    this.isPaused = false

    switch (toPlay.source) {
      case 'YOUTUBE':
        await this.playYoutubeVideo(request, toPlay.url, connection)
        break
      case 'LOCAL':
        await this.playLocal(request, toPlay.url, connection)
        break
    }
  }

  async playYoutubeVideo (request, url, connection) {
    try {
      console.log('INFO:PLAYING - ' + this.nowPlaying)
      const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' })
      var dispatcher = await connection.play(stream)
      dispatcher.setVolume(this.volume)

      this.nowPlaying.source = 'YOUTUBE'
      this.printSongInfo(request)

      dispatcher.on('finish', () => {
        this.playNext(request, connection)
      })

      dispatcher.on('error', () => {
        this.playNext(request, connection)
      })
    } catch (error) {
      console.log('ERORR: YT - ' + this.nowPlaying + '\n' + error)
      var newConnection = await request.joinAuthorVoiceChannel()
      this.playNext(request, newConnection)
    }
  }

  async playLocal (request, url, connection) {
    try {
      var dispatcher = await connection.play(url)
      dispatcher.setVolume(this.volume)

      dispatcher.on('finish', async () => {
        this.playNext(request, connection)
      })

      dispatcher.on('error', async () => {
        this.playNext(request, connection)
      })
    } catch (error) {
      console.log('ERROR: LOCAL - ' + this.nowPlaying + '\n' + error)
    }
  }

  async printSongInfo (request) {
    var info = await ytdl.getBasicInfo(this.nowPlaying.url)

    if (info.title === undefined || isNaN(info.length_seconds)) return

    var length = this.makeVideoLengthReadable(info.length_seconds)

    var songInfoString = info.title + '\n' + length
    request.reply('```Now Playing:\n' + songInfoString + '```')
  }

  makeVideoLengthReadable (lengthSeconds) {
    var minutes = Math.floor(lengthSeconds / 60)
    var seconds = lengthSeconds % 60

    if (seconds < 10) {
      seconds = '0' + seconds
    }

    return minutes + ':' + seconds
  }

  async waitToDisconnect (request) {
    var thisFinishTime = Date.now()
    this.lastFinishTime = thisFinishTime

    var parent = this

    // Check every second if bot should disconnect, or stop waiting
    var interval = setInterval(function () {
      // Stop waiting if bot activity happens.
      if (thisFinishTime !== parent.lastFinishTime || parent.isPlaying) {
        clearInterval(interval)
        return
      }

      // Disconnect if bot exceeds max afk time
      if ((Date.now() - thisFinishTime) > parent.idleDisconnectDelayMS) {
        request.disconnectBot(null, 'bot is idle - disconnecting.')
        clearInterval(interval)
      }
    }, 1000)
  }
}

module.exports = GuildPlayer
