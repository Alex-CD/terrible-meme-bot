class Info {
    constructor(player){
        this.player = player;
        this.aliases = ["info", "song"];
    }

    run(command, message){
        if(this.player.hasPlayer(message.guild.id)){
            var player = this.player.get(message.guild.id);
            if(player.state == "PLAYING" || player.state == "PAUSED"){
                player.printSongInfo(message);
            }
        }
    }
}

module.exports = Info;