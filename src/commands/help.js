class Help {
  constructor () {
    this.aliases = ['help', 'commands']
  }

  async run (request) {
    request.reply('Available commands: !help, !info, !play, !pause, !skip, !stop, !v, !volume, !russianroulette')
  }
}

module.exports = Help
