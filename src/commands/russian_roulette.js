var random = require('random')

class RussianRoulette {
  constructor () {
    this.aliases = ['russianroulette', 'rr']
  }

  async run (request) {
    var channel = request.message.guild.member(request.message.author).voice.channel

    if (!channel) {
      await request.reply('You need to be connected to a voice channel to use this command.')
      return
    }

    var users = channel.members.keyArray()
    var userToDisconnect = request.message.guild.member(users[random.int(0, users.length - 1)])

    await userToDisconnect.voice.setChannel(null, 'User failed the russian roulette')
  }
}

module.exports = RussianRoulette
