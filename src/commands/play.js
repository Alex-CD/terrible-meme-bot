const ytdl = require('ytdl-core');
const ytlist = require('youtube-playlist');

var bot = require('../botUtils');


class Play {
    constructor(settings, players){
        this.aliases = ["play", "hyt"];
        this.players = players;
    }


    async run(command, message) {
        if (!bot.isUserConnected) {
            message.channel.send("You need to be in a channel to request songs.");
            return;
        }

        if(command == ""){
            await this.players.get(message.guild.id).resume();
            return;
        }

        // if message is 'hidden youtube'
        if(message.content.slice(1).split(' ')[0] === "hyt"){
            await message.delete();
        }

        this.players.get(message.guild.id).play(message, command, "YOUTUBE");
    }
}

module.exports = Play;