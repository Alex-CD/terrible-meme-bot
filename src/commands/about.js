class About {
  constructor () {
    this.aliases = ['about']
  }

  async run (request) {
    var name = process.env.npm_package_name
    var version = process.env.npm_package_version
    var repositoryURL = 'github.com/Alex-CD/terrible-meme-bot'

    var uptime = this.secondsToDaysHoursSeconds(Math.floor(process.uptime()))

    var toSend = '```\n' + name + '\nv' + version + '\nDistributed under GPL v3.0\nhttps://' + repositoryURL + '\n' +
    'Uptime: ' + uptime + '```'
    await request.reply(toSend)
  }

  secondsToDaysHoursSeconds (lengthSeconds) {
    var days = Math.floor(lengthSeconds / (60 * 60 * 24))
    lengthSeconds = lengthSeconds - (days * (60 * 60 * 24))

    var hours = Math.floor(lengthSeconds / (60 * 60))
    lengthSeconds = lengthSeconds - (hours * (60 * 60 * 24))

    var minutes = Math.floor(lengthSeconds / 60)
    var seconds = lengthSeconds - (minutes * 60)

    if (seconds < 10) {
      seconds = '0' + seconds
    }

    return days + 'd' + hours + 'h' + minutes + 'm' + seconds + 's'
  }
}

module.exports = About
