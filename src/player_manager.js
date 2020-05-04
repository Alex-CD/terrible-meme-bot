var Player = require('./player');

class PlayerManager {
    constructor() {
        this.players = new Map();
    }

    async makePlayer(guildID){
        this.players.set(guildID, new Player());
    }

    get(guildID){
        if(!this.hasPlayer(guildID)){
            this.makePlayer(guildID);
        }

        return this.players.get(guildID);
    }

    hasPlayer(guildID){
        return this.players.has(guildID);
    }

}

module.exports = PlayerManager;