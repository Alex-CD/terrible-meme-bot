const AudioQueue = require('./audio_queue')

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

  async play (request, url, source, shuffle) {
    if (this.isPaused) {
      this.stop(request)
    }

    const videosQueued = await this.audioQueue.add(url, source)

    if (source === 'YOUTUBE') {
      switch (true) {
        case videosQueued === 0:
          request.reply('No videos queued. Sorry! This is usually a bug with youtube. ' +
            'Poke Alex please!')
          return
        case videosQueued === 1:
          request.reply('Song queued.')
          break
        case videosQueued > 1:
          request.reply('Enqueued ' + videosQueued + ' songs')

          if (shuffle) {
            this.audioQueue.shuffle()
            request.reply('Shuffled playlist')
          }
          break
        default:
          request.reply('Invalid video/playlist url')
          return
      }
    }

    if (!this.isPlaying) {
      const connection = await request.joinAuthorVoiceChannel()
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

  async shuffle (request) {
    if (this.audioQueue.isEmpty()) {
      await request.reply('Cannot shuffle empty playlist')
    }

    this.audioQueue.shuffle()
  }

  async pause (request) {
    try {
      if (this.isPlaying && !this.isPaused) {
        const connection = await this.getConnection(request)
        await connection.dispatcher.pause()

        this.isPaused = true
      }
    } catch (error) {
      console.log('ERROR: Pause - ' + error)
    }
  }

  async resume (request) {
    if (this.isPlaying && this.isPaused) {
      const connection = await this.getConnection(request)
      if (connection) {
        await connection.dispatcher.resume()

        this.isPaused = false
      }

      return
    }

    request.reply('Player is not paused.')
  }

  async getConnection (request) {
    const thisConnection = await request.message.client.voice.connections.filter((connection) => {
      return connection.channel.id === request.message.guild.me.voice.channel.id
    })
    return thisConnection.first()
  }

  async skip (request) {
    if (this.isPlaying || this.isPaused) {
      const connection = await this.getConnection(request)
      await connection.dispatcher.end()
    }
  }

  async stop (request) {
    this.audioQueue.clear()
    this.isPlaying = false
    this.isPaused = false

    const connection = await this.getConnection(request)
    if (connection.dispatcher) {
      await connection.dispatcher.end()
    }
  }

  async setVolume (request, volume) {
    if (!Number.isInteger(volume) || volume < 0 || volume > 9999) return

    this.volume = volume / 100.0

    try {
      const connection = await this.getConnection(request)
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
    const toPlay = this.audioQueue.get()

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
      const dispatcher = await connection.play(stream)
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
      const newConnection = await request.joinAuthorVoiceChannel()
      this.playNext(request, newConnection)
    }
  }

  async playLocal (request, url, connection) {
    try {
      const dispatcher = await connection.play(url)
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
    const info = await ytdl.getBasicInfo(this.nowPlaying.url)

    if (info.title === undefined || isNaN(info.length_seconds)) return

    const length = this.makeVideoLengthReadable(info.length_seconds)

    const songInfoString = info.title + '\n' + length
    request.reply('```Now Playing:\n' + songInfoString + '```')
  }

  makeVideoLengthReadable (lengthSeconds) {
    const minutes = Math.floor(lengthSeconds / 60)
    let seconds = lengthSeconds % 60

    if (seconds < 10) {
      seconds = '0' + seconds
    }

    return minutes + ':' + seconds
  }

  async waitToDisconnect (request) {
    const thisFinishTime = Date.now()
    this.lastFinishTime = thisFinishTime

    const parent = this

    // Check every second if bot should disconnect, or stop waiting
    const interval = setInterval(function () {
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
