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
        if (ytpl.validateID(url)) {
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
    return 'https://youtube.com/watch?v=' + this.extractVideoID(url)
  }

  async parseYoutubePlaylist (url) {
    const playlist = await ytpl(this.extractPlaylistID(url), { limit: 200 })
    if (!playlist.items.length) {
      return
    }

    const videos = []
    for (let i = 0; i < playlist.items.length; i++) {
      videos.push(playlist.items[i].shortUrl)
    }
    // Get index in list of current video
    let thisVideoIndex = videos.indexOf(this.normalizeYoutubeURL(url))

    // Queue whole playlist if can't find current video
    if (thisVideoIndex === -1) thisVideoIndex = 0

    // queue everything forward of 'this video'
    for (let i = thisVideoIndex; i < videos.length; i++) {
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

  extractVideoID (url) {
    const urlParams = new URLSearchParams(new URL(url).search)
    return urlParams.get('v')
  }

  extractPlaylistID (url) {
    const urlParams = new URLSearchParams(new URL(url).search)
    return urlParams.get('list')
  }
}

module.exports = AudioQueue
