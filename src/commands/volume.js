class Volume  {
    constructor(players){
        this.players = players;
        this.aliases = ["volume"];
    }

    run(command, message){

        var volume = parseFloat(message);

        if(volume == NaN){
            message.channel.send("Invalid volume");
        }

        this.players.get(message.guild.id).setVolume(volume);
    }
}

module.exports = Volume;