const bot = require('../bot_utils');

class Pause {
    constructor(settings, players){
        this.players = players;
        this.aliases = ["pause"];
    }

    async run(command, message){

        if(bot.isBotConnectedToGuild(message)){
            await this.players.get(message.guild.id).pause(message);
            return;
        }

        message.channel.send("Bot isn't connected");
    }
}

module.exports = Pause;