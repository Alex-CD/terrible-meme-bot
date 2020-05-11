class Volume {
  constructor (settings, players) {
    this.players = players
    this.aliases = ['volume']
  }

  run (command, message) {
    var volume = parseFloat(command)

    if (isNaN(volume)) {
      message.channel.send('Invalid volume')
    }

    this.players.get(message.guild.id).setVolume(message, volume)
  }
}

module.exports = Volume
