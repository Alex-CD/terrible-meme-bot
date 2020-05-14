class Restart {
  constructor () {
    this.aliases = ['restart']
  }

  async run (request) {
    process.kill(process.pid, 'SIGINT')
  }
}

module.exports = Restart
