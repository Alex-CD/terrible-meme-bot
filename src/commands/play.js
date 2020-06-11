
class Play {
  constructor (settings, players) {
    this.aliases = ['play']
    this.players = players
  }

  async run (request) {
    if (!request.isAuthorConnected()) {
      await request.reply('You need to be in a channel to request songs.')
      return
    }

    // User may be trying to resume a paused queue
    if (request.content === '') {
      await this.players.get(request.guildID).resume(request)
      return
    }

    await this.players.get(request.guildID).play(request, request.content, 'YOUTUBE')
  }
}

module.exports = Play
