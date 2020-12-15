
class Stop {
  constructor (settings, players) {
    this.players = players
    this.aliases = ['stop']
  }

  async run (request) {
    if (request.isBotConnectedToGuild()) {
      const player = this.players.get(request.guildID)
      await player.stop(request)
    }
  }
}

module.exports = Stop
