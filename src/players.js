var guildPlayer = require('./guildplayer');

class Players {
    constructor() {
        this.guildPlayers = new Map();
    }

    async makePlayer(guildID){
        this.guildPlayers.set(guildID, new guildPlayer());
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