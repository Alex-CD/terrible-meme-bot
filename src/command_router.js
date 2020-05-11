class CommandRouter {
  constructor (settings, players, commands) {
    this.settings = settings
    this.commands = commands
  }

  route (message, messageText) {
    // Ignore messages that don't start with a prefix, are a PM, or come from another bot
    if (!messageText.startsWith(this.settings.prefix) || message.author.bot || message.channel.type !== 'text') return

    var command = messageText.split(' ')[0]
    var trimmedCommand = this.trimCommand(this.removeSpaces(messageText))

    // Match requested command aliases
    for (const module in this.commands) {
      var aliases = this.commands[module].aliases

      for (var a = 0; a < aliases.length; a++) {
        if (command === this.settings.prefix + aliases[a]) {
          this.commands[module].run(trimmedCommand, message)
        }
      }
    }
  }

  // Removes leading, trailing, and duplicate spaces
  removeSpaces (string) {
    var split = string.split(' ')
    var out = ''

    for (var i = 0; i < split.length; i++) {
      if (split[i].length > 0) {
        out += split[i] + ' '
      }
    }

    return out.slice(0, -1)
  }

  // Removes the initial command (e.g '!set sometext' -> 'sometext' from a string
  trimCommand (contents) {
    if (contents.split(' ').length === 1) return ''
    return contents.split(/ (.+)/)[1]
  }
}

module.exports = CommandRouter
