const fs = require('fs');
const random = require('random');
const bot = require('../bot_utils');


class PlayLocal {
    constructor(settings, players) {
        this.players = players;
        this.aliases = ["v"];
        this.audioDir = process.env.LOCAL_AUDIO_DIR + "/"
        this.audioFiles = new Map();
        this.loadAudioFiles();
    }

    async run(command, message) {

        if (command == "help") {
            this.printCommands(message);
            return;
        }

        if (!bot.isUserConnected(message)) {
            message.channel.send("You need to be in a voice channel to play audio");
            return;
        }

        var requestedFiles = this.audioFiles.get(command);

        if (!requestedFiles) {
            message.channel.send("Unknown audio clip");
            return;
        }


        var player = this.players.get(message.guild.id);
        var toPlay = this.audioDir + command + "/" + requestedFiles[random.int(0, requestedFiles.length - 1)];

        message.delete();

        if (player.state == "PLAYING") {
            await player.interrupt(message, toPlay, "LOCAL" );
        } else { 
            await player.play(message, toPlay, "LOCAL");
        }

       
    }

    loadAudioFiles() {
        console.log("Loading audio files from " + this.audioDir);
        var directories = fs.readdirSync(this.audioDir);

        for (var i = 0; i < directories.length; i++) {
            var files = fs.readdirSync(this.audioDir + directories[i]);
            this.audioFiles.set(directories[i], files);
        }
    }

    printCommands(message) {

        var out = "```Use !v [sound] to play a sound.\nAvailable commands: ";

        var keys = this.audioFiles.keys();

        var key = keys.next();

        while (!key.done) {
            out += key.value;
            key = keys.next();

            if (!key.done) out += ", ";
        }

        out += "```"

        message.channel.send(out);
    }
}



module.exports = PlayLocal;