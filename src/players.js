var guildPlayer = require('./guildplayer');

class Players {
    constructor() {
        this.guildPlayers = new Map();
    }

    async play(message, url) {

        if(!this.hasPlayer(message.guild.id)){
            this.makePlayer(message.guild.id)
        }

        this.guildPlayers.get(message.guild.id).queue(message, url);
    }

    async makePlayer(guildID){
        this.guildPlayers.set(guildID, new guildPlayer());
    }

    async resume(message){
        this.guildPlayers.get(message.guild.id).resume(message);
    }

    get(guildID){
        if(!this.hasPlayer(guildID)){
            this.makePlayer(guildID);
        }

        return this.guildPlayers.get(guildID);
    }

    hasPlayer(guildID){
        return this.guildPlayers.has(guildID);
    }

}

module.exports = Players;