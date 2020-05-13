class Skip {
  constructor (settings, players) {
    this.players = players
    this.aliases = ['skip']
  }

  async run (request) {
    await this.players.get(request.guildID).skip(request)
  }
}

module.exports = Skip
