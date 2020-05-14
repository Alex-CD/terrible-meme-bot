
class Pause {
  constructor (settings, players) {
    this.players = players
    this.aliases = ['pause']
  }

  async run (request) {
    if (request.isBotConnectedToGuild) {
      await this.players.get(request.guildID).pause(request)
      return
    }

    request.reply('Bot isn\'t connected')
  }
}

module.exports = Pause
