const bot = require('../botUtils');

class Stop {
    constructor(settings, players) {
        this.players = players;
        this.aliases = ["stop"];
    }

    async run(command, message) {
        if (bot.isBotConnectedToGuild(message)) {


            if (this.players.hasPlayer(message.guild.id)) {
                var player = this.players.get(message.guild.id);
                player.stop(message);
            } else {


                var thisConnection = await message.client.voice.connections.filter((connection) => {
                    return connection.channel.id === message.guild.me.voice.channel.id;
                });

                await thisConnection.first().dispatcher.stop();
            }
        }

    }
}

module.exports = Stop;