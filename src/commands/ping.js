class Ping {
  constructor () {
    this.aliases = ['ping']
  }

  async run (request) {
    var diff = Date.now() - request.message.createdAt
    request.reply('Pong: ' + diff + 'ms')
  }
}

module.exports = Ping
