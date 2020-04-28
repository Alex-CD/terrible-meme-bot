class Volume  {
    constructor(settings, players){
        this.players = players;
        this.aliases = ["volume"];
    }

    run(command, message){

        var volume = parseFloat(command);

        if(volume == NaN){
            message.channel.send("Invalid volume");
        }
        
        var player = this.players.get(message.guild.id);
        player.setVolume(message, volume);
    }
}

module.exports = Volume;