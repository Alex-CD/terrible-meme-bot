class MessageStub {
  constructor (settings) {
    const defaultVals = {
      contents: '!test Hello world',
      type: 'text',
      author: '1234',
      bot: false,
      channel: '12345'
    }

    // Replacing default values with passed settings, if they exist
    this.state = Object.assign(defaultVals, settings)
    this.state.sentMessages = []
    this.state.voiceChannel = '000'

    const state = this.state

    this.contents = this.state.contents

    this.channel = { type: state.type, send: function (string) { state.sentMessages.push(string) } }
    this.author = { id: state.author, bot: state.bot }
    this.guild = {
      me:
            { voice: { setChannel: function (channel, message) { state.voiceChannel = channel } } }
    }
    this.member = { voice: { channel: state.channel } }
  }
}

module.exports = MessageStub
