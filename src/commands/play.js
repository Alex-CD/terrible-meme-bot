
class Play {
  constructor (settings, players) {
    this.aliases = ['play', 'hyt']
    this.players = players
  }

  async run (request) {
    if (!request.isAuthorConnected()) {
      request.reply('You need to be in a channel to request songs.')
      return
    }

    if (request.content === '') {
      await this.players.get(request.guildID).resume(request)
      return
    }

    // if message is 'hidden youtube'
    if (request.command === 'hyt') {
      await request.deleteMessage()
    }

    this.players.get(request.guildID).play(request, request.content, 'YOUTUBE')
  }
}

module.exports = Play
