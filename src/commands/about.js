class About {
  constructor () {
    this.aliases = ['about']
  }

  async run (command, message) {
    var name = process.env.npm_package_name
    var version = process.env.npm_package_version
    var repositoryURL = 'github.com/Alex-CD/terrible-meme-bot'

    var toSend = '```\n' + name + '\nv' + version + '\nDistributed under GPL v3.0\nhttps://' + repositoryURL + '\n```'
    await message.channel.send(toSend)
  }
}

module.exports = About
