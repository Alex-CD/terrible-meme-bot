class Volume {
  constructor (settings, players) {
    this.players = players
    this.aliases = ['volume']
  }

  async run (request) {
    var volume = parseFloat(request.text)

    if (isNaN(volume)) {
      request.reply('Invalid volume')
    }

    this.players.get(request.guildID).setVolume(request, volume)
  }
}

module.exports = Volume
