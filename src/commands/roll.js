const random = require('random')

class Roll {
  constructor () {
    this.aliases = ['roll', 'r']
  }

  run (command, message) {
    var args = command.split(' ')
    var argsInt = []

    for (var i = 0; i < args.length; i++) {
      if (!Number.isInteger(parseInt(args[i]) || args[i] === '')) {
        message.channel.send('Invalid argument(s).')
        return
      }

      argsInt.push(parseInt(args[i]))
    }

    switch (args.length) {
      case 1:
        message.channel.send(random.int(0, argsInt[0]))
        break
      case 2:
        message.channel.send(random.int(argsInt[0], argsInt[1]))
        break
      default:
        message.channel.send('!roll needs two arguments.')
        break
    }
  }
}

module.exports = Roll
