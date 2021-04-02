class Ping {
  constructor () {
    this.aliases = ['ping']
  }

  async run (request) {
    const diff = Date.now() - request.message.createdAt
    await request.reply('Pong: ' + diff + 'ms')
  }
}

module.exports = Ping
