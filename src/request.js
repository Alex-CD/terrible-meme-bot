class Request {
  constructor (message) {
    this.message = message
    this.authorID = message
    this.guildID = message.guild.id
    this.raw = message.content
    this.content = undefined
    this.command = undefined
  }

  isDirectMessage () {
    return this.message.channel.type === 'dm'
  }

  async joinAuthorVoiceChannel () {
    if (this.isAuthorChannelJoinable()) {
      return await this.message.member.voice.channel.join()
    }
  }

  startsWithPrefix (prefix) {
    return this.message.content.startsWith(prefix)
  }

  getJoinableVoiceChannels () {
    return this.message.guild.channels.cache.filter((channel) => {
      return (channel.type === 'voice' && channel.joinable)
    })
  }

  isAuthorChannelJoinable () {
    return this.message.member.voice.channel.joinable
  }

  isFromGuildTextChannel () {
    return this.message.channel.type === 'text'
  }

  authorIsBot () {
    return this.message.author.bot
  }

  async reply (text) {
    try {
      await this.message.channel.send(text)
    } catch {
      // TODO
    }
  }

  async deleteMessage () {
    if (this.message.channel.manageable) {
      await this.message.delete()
    }
  }

  async disconnectBot (reason) {
    await this.message.guild.me.voice.setChannel(null, reason)
  }

  isAuthorConnected () {
    return this.message.member.voice.channel != null
  }

  async isBotInAuthorChannel () {
    return await this.message.guild.me.voice.channel === this.message.member.voice.channel
  }

  isBotConnectedToGuild () {
    return this.message.guild.me.voice.channel != null
  }

  parseRequestText () {
    this.command = this.message.content.split(' ')[0]
    this.content = this.trimCommand(this.trimSpaces(this.raw))
  }

  // Removes any extra spaces from the message
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

  // Removes the initial command (e.g '!set sometext' -> 'sometext' from a string
  trimCommand (contents) {
    if (contents.split(' ').length === 1) return ''
    return contents.split(/ (.+)/)[1]
  }
}

module.exports = Request
