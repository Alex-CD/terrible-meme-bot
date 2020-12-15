class About {
  constructor () {
    this.aliases = ['about']
  }

  async run (request) {
    const name = process.env.npm_package_name
    const version = process.env.npm_package_version
    const repositoryURL = 'github.com/Alex-CD/terrible-meme-bot'

    const uptime = this.secondsToDaysHoursSeconds(Math.floor(process.uptime()))

    const toSend = '```\n' + name + '\nv' + version + '\nDistributed under GPL v3.0\nhttps://' + repositoryURL + '\n' +
    'Uptime: ' + uptime + '```'
    await request.reply(toSend)
  }

  secondsToDaysHoursSeconds (lengthSeconds) {
    const days = Math.floor(lengthSeconds / (60 * 60 * 24))
    lengthSeconds = lengthSeconds - (days * (60 * 60 * 24))

    const hours = Math.floor(lengthSeconds / (60 * 60))
    lengthSeconds = lengthSeconds - (hours * (60 * 60 * 24))

    const minutes = Math.floor(lengthSeconds / 60)
    let seconds = lengthSeconds - (minutes * 60)

    if (seconds < 10) {
      seconds = '0' + seconds
    }

    return days + 'd' + hours + 'h' + minutes + 'm' + seconds + 's'
  }
}

module.exports = About
