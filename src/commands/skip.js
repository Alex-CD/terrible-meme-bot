class Skip {
    constructor(players) {
        this.players = players;
        this.aliases = ["skip"];
    }

    async run(command, message) {
        await this.players.get(message.guild.id).skip(message);
    }
}

module.exports = Skip;