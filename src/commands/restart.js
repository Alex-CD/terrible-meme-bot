class Restart {
  constructor () {
    this.aliases = ['restart']
  }

  async run (request) {
    console.log('KILLING PROCESS ON USER RESTART COMMEND')
    process.kill(process.pid, 'SIGINT')
  }
}

module.exports = Restart
