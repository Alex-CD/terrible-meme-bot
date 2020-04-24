const fs = require('fs');
const random = require('random');
const bot = require('../botUtils');


class PlayLocal {
    constructor(players) {
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

        if (!bot.isBotInUsersChannel && !bot.isBotPlaying) {
            message.channel.send("Bot is already playing for someone else :(");
        }




        var requestedFiles = this.audioFiles.get(command);

        if (!requestedFiles) {
            message.channel.send("Unknown audio clip");
            return;
        }


        if (this.players.hasPlayer(message.guild.id)) {
            var player = this.players.get(message.guild.id);

            if (player.state == "PLAYING" || player.state == "PAUSED") {

                player.interrupt(message);
            }
        }

        message.delete();

        var connection = await message.member.voice.channel.join();
        var toPlay = this.audioDir + command + "/" + requestedFiles[random.int(0, requestedFiles.length - 1)];
        var dispatcher = await connection.play(toPlay);



        dispatcher.on('finish', () => {
            if (player) { 
                player.uninterrupt(message)
            };
        });


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