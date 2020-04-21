const ytdl = require('ytdl-core');
const ytlist = require('youtube-playlist');

var bot = require('../botUtils');


class Play {
    constructor(players){
        this.aliases = ["play"];
        this.players = players;
    }


    async run(command, message) {
        console.log(this.players);
        if (!bot.isUserConnected) {
            message.channel.send("You need to be in a channel to request songs.");
            return;
        }

        this.players.play(message, command);
    }
}

module.exports = Play;