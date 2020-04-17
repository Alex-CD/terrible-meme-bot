const fs = require('fs');
const random = require('random');
const bot = require('../botUtils');


class PlayLocal {
    constructor() {
        this.aliases = ["v"];
        this.audioFiles = new Map();
        this.loadAudioFiles();
    }

    async run(command, message) {

        if(command == "help"){
            this.printCommands(message);
            return;
        }

        if(command == "reload"){
            this.audioFiles.clear();
            this.loadAudioFiles();
            message.channel.send("Audio files regenerated.");
        }

        if (!bot.isUserConnected(message)) {
            message.channel.send("You need to be in a voice channel to play audio");
            return;
        }

        if(!bot.isBotInUsersChannel && !bot.isBotPlaying){
            message.channel.send("Bot is already playing for someone else :(");
        }


        var requestedFiles = this.audioFiles.get(command);

        if(!requestedFiles){
            message.channel.send("Unknown audio clip");
            return;
        }

        var connection = await message.member.voice.channel.join();

        var toPlay = "./audio/" + command + "/" + requestedFiles[random.int(0, requestedFiles.length - 1)];
        var dispatcher = await connection.play(toPlay);

        console.log(toPlay);
        
        dispatcher.on('finish', () => {
            dispatcher.destroy();
        });

        message.delete();
    }

    loadAudioFiles() {
       var directories = fs.readdirSync("./audio/");

        for(var i = 0; i < directories.length; i++){
            var files = fs.readdirSync("./audio/" + directories[i]);
            this.audioFiles.set(directories[i], files);      
        }
    }

    printCommands(message){

        var out = "```Use !v [sound] to play a sound.\nAvailable commands:";

        var keys = this.audioFiles.keys();

        var key = keys.next();

        while(!key.done){
            out += key.value;
            key = keys.next();

            if(!key.done) out += ", ";
        }

        out += "```"

        message.channel.send(out);
    }
}



module.exports = PlayLocal;