const bot = require('../botUtils');

class Pause {
    constructor(settings, players){
        this.players = players;
        this.aliases = ["pause"];
    }

    async run(command, message){

        if (bot.isBotConnectedToGuild(message) && this.players.hasPlayer(message.guild.id)) {
            await this.players.get(message.guild.id).pause(message);
        }
    }
}

module.exports = Pause;