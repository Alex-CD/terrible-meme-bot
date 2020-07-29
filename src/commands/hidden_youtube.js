class HiddenYoutube {
  constructor (settings, players) {
    this.aliases = ['hyt']
    this.players = players
  }

  async run (request) {
    if (!request.isAuthorConnected()) {
      await request.reply('You need to be in a channel to request songs.')
      return
    }
    await request.deleteMessage()

    await this.players.get(request.guildID).play(request, request.content, 'YOUTUBE')
  }
}

module.exports = HiddenYoutube
