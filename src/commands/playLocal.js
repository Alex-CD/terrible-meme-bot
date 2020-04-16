const fs = require('fs');
const bot = require('../botUtils');

class PlayLocal {
    constructor() {
        this.aliases = ["v", "hv"];
        this.audioFiles = new Map();
        this.loadAudioFiles();
    }

    async run(command, message) {
        if (!bot.isUserConnected(message)) {
            message.channel.send("You need to be in a voice channel to play audio");
            return;
        }

        if(!bot.isInUsersChannel){

        }

        if(!this.audioFiles.get(command)){
            message.channel.send("Unkown audio clip");
        }


        var connection = await message.member.voice.channel.join();
        const dispatcher = connection.play("./audio/Javolenus_-_Garage_Groove.mp3");

        dispatcher.on('finish', () => {
            dispatcher.destroy();
        });
    }

    loadAudioFiles() {

       var directories = fs.readdirSync("./audio/");

        for(var i = 0; i < directories.length; i++){
            var files = fs.readdirSync("./audio/" + directories[i]);
            this.audioFiles.set(directories[i], files);      
        }


    }
}



module.exports = PlayLocal;