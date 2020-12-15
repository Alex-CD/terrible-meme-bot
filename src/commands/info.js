class Info {
  constructor (settings, players) {
    this.player = players
    this.aliases = ['info', 'song']
  }

  async run (request) {
    if (this.player.hasPlayer(request.guildID)) {
      const player = this.player.get(request.guildID)
      if (player.state === 'PLAYING' || player.state === 'PAUSED') {
        player.printSongInfo(request)
      }
    }
  }
}

module.exports = Info
