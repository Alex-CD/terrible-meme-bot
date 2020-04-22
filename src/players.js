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

    async resume(message){
        this.guildPlayers.get(message.guild.id).resume(message);
    }

    get(guildID){
        return this.guildPlayers.get(guildID);
    }

    hasPlayer(guildID){
        return this.guildPlayers.has(guildID);
    }

}

module.exports = Players;