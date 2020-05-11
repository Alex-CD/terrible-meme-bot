var random = require('random')

class RussianRoulette {
  constructor () {
    this.aliases = ['russianroulette', 'rr']
  }

  async run (command, message) {
    var channel = message.guild.member(message.author).voice.channel

    if (!channel) {
      await message.channel.send('You need to be connected to a voice channel to use this command.')
      return
    }

    var users = channel.members.keyArray()
    var userToDisconnect = message.guild.member(users[random.int(0, users.length - 1)])

    await userToDisconnect.voice.setChannel(null, 'User failed the russian roulette')
  }
}

module.exports = RussianRoulette
