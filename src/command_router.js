class CommandRouter {
  constructor (settings, players, commands) {
    this.settings = settings
    this.commands = commands
  }

  route (request) {
    // Ignore messages that don't start with a prefix, are a PM, or come from another bot
    if (!request.startsWithPrefix(this.settings.prefix) || request.authorIsBot() || !request.isFromGuildTextChannel()) return
    request.parseRequestText()

    // Match requested command aliases
    for (const module in this.commands) {
      const aliases = this.commands[module].aliases

      for (let a = 0; a < aliases.length; a++) {
        if (request.command === this.settings.prefix + aliases[a]) {
          this.commands[module].run(request)
        }
      }
    }
  }
}

module.exports = CommandRouter
