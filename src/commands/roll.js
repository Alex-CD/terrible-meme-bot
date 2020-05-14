const random = require('random')

class Roll {
  constructor () {
    this.aliases = ['roll', 'r']
  }

  async run (request) {
    var args = request.content.split(' ')
    var argsInt = []

    for (var i = 0; i < args.length; i++) {
      if (!Number.isInteger(parseInt(args[i]) || args[i] === '')) {
        request.reply('Invalid argument(s).')
        return
      }

      argsInt.push(parseInt(args[i]))
    }

    switch (args.length) {
      case 1:
        request.reply(random.int(0, argsInt[0]))
        break
      case 2:
        request.reply(random.int(argsInt[0], argsInt[1]))
        break
      default:
        request.reply('!roll needs two arguments.')
        break
    }
  }
}

module.exports = Roll
