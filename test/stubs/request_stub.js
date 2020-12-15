
class RequestStub {
  constructor (message) {
    this.replies = []
    const defaultVals = {
      isConnected: false,
      text: 'Hello world',
      type: 'text',
      author: '1234',
      bot: false,
      channel: '12345'
    }

    this.state = Object.assign(defaultVals, message)
  }

  startsWithPrefix (prefix) {
    return this.state.text.startsWith(prefix)
  }

  isFromGuildTextChannel () {
    return this.state.type === 'text'
  }

  disconnectBot (reason) {
    this.state.isConnected = false
  }

  parseRequestText () {
    this.command = this.state.text.split(' ')[0]
    this.content = this.trimCommand(this.trimSpaces(this.state.text))
  }

  trimSpaces (string) {
    const split = string.split(' ')
    let out = ''

    for (let i = 0; i < split.length; i++) {
      if (split[i].length > 0) {
        out += split[i] + ' '
      }
    }

    return out.slice(0, -1)
  }

  trimCommand (contents) {
    if (contents.split(' ').length === 1) return ''
    return contents.split(/ (.+)/)[1]
  }

  reply (text) {
    this.replies.push(text)
  }

  authorIsBot () {
    return this.state.bot
  }
}

module.exports = RequestStub
