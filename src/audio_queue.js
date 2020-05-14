const ytlist = require('youtube-playlist')
const ytdl = require('ytdl-core')
const ytpl = require('ytpl')

class AudioQueue {
  constructor () {
    this.items = []
  }

  async add (url, source) {
    if (url === '' || url === null) {
      return null
    }

    switch (source) {
      case 'YOUTUBE':
        if (ytpl.validateURL(url)) {
          return await this.parseYoutubePlaylist(url)
        }

        if (ytdl.validateURL(url)) {
          this.queue(this.normalizeYoutubeURL(url), source)
          return 1
        }

        return null
      case 'LOCAL':
        this.queue(url, source)
        return 1
      default:
        return null
    }
  }

  isEmpty () {
    return this.items.length === 0
  }

  get () {
    return this.items.shift()
  }

  jumpQueue (url, source) {
    this.items.unshift({ url: url, source: source })
  }

  normalizeYoutubeURL (url) {
    var videoID = ''

    if (url.includes('youtu.be/')) {
      videoID = (url.split('.be/')[1]).split('?')[0]
    } else {
      videoID = (url.split('watch?v=')[1]).split('&')[0]
    }

    return 'https://youtube.com/watch?v=' + videoID
  }

  async parseYoutubePlaylist (url) {
    var list = await ytlist(url, 'url')

    // Get index in list of current video
    var thisVideoIndex = list.data.playlist.indexOf(this.normalizeYoutubeURL(url))
    var videos = list.data.playlist

    // Queue whole playlist if can't find current video
    if (thisVideoIndex === -1) thisVideoIndex = 0

    for (var i = thisVideoIndex; i < videos.length; i++) {
      this.queue(videos[i], 'YOUTUBE')
    }

    return videos.length - thisVideoIndex
  }

  queue (url, source) {
    this.items.push({ url: url, source: source })
  }

  clear () {
    this.items = []
  }
}

module.exports = AudioQueue
