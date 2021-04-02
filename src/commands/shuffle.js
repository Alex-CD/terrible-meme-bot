class Shuffle {
  constructor (settings, players) {
    this.aliases = ['shuffle']
    this.players = players
  }

  async run (request) {
    if (!request.isAuthorConnected()) {
      await request.reply('You need to be in a channel to request songs.')
      return
    }

    if (request.content === '') {
      await this.players.get(request.guildID).shuffle(request)
      await request.reply('Shuffled playlist')
      return
    }

    await this.players.get(request.guildID).play(request, request.content, 'YOUTUBE', true)
  }
}

module.exports = Shuffle
