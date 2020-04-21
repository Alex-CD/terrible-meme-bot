var guildPlayer = require('./guildplayer');

class Players {
    constructor() {
        this.guildPlayers = new Map();
    }

    async play(message, url) {

        if(!this.hasPlayer(message.guild.id)){
            this.guildPlayers.set(message.guild.id, new guildPlayer());
        }

        this.guildPlayers.get(message.guild.id).queue(message, url);
    }

    hasPlayer(guildID){
        return this.guildPlayers.has(guildID);
    }

}

module.exports = Players;