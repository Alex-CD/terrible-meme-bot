class Volume {
  constructor (settings, players) {
    this.players = players
    this.aliases = ['volume', 'setvolume']
  }

  async run (request) {
    var volume = Number.parseInt(request.content)
    if (isNaN(volume) || volume < 0 || volume > 9999) {
      request.reply('Volume must be an integer (0-100)')
      return
    }
    this.players.get(request.guildID).setVolume(request, volume)
  }
}

module.exports = Volume
