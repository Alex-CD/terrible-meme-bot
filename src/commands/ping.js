const { Command } = require('discord-akairo');

class Ping extends Command {
    constructor() {
        super('ping', {
           aliases: ['ping'] 
        });
    }

    exec(message) {
        return message.reply('pong: ' + (Date.now() - message.createdAt) + "ms");
    }
}

module.exports = Ping;