const bot = require('../bot_utils')

class Stop {
  constructor (settings, players) {
    this.players = players
    this.aliases = ['stop']
  }

  async run (command, message) {
    if (bot.isBotConnectedToGuild(message)) {
      var player = this.players.get(message.guild.id)
      await player.stop(message)
    }
  }
}

module.exports = Stop
