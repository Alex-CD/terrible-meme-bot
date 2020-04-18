const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const ytlist = require('youtube-playlist');

var bot = require('../botUtils');



class Play {
    constructor() {
        this.videoQueue = [];
        this.aliases = ["play"];
        this.connection = null;
        this.dispatcher = null;
        this.isPlaying = false;
    }


    async run(command, message) {
        if (command == "skip") {
            console.log("skipped!");
            this.playNextVideo();
            return;
        }

        if (command == "reset") {
            this.videoQueue = [];
            this.isPlaying = false;
            this.connection.destroy();
            return;
        }

        if (!bot.isUserConnected) {
            message.channel.send("You need to be in a channel to request songs.");
            return;
        }

        if (ytdl.validateURL(command)) {

            if (ytpl.validateURL(command)) {
                var list = await ytlist(command, 'url')
                var videos = list.data.playlist;

                console.log(videos);
                for (var i = 0; i < videos.length; i++) {
                    this.videoQueue.push(videos[i]);
                }


            } else {
                this.videoQueue.push(command);
            }
        } else {
            message.channel.send("Invalid video URL");
            return;
        }


        if (!this.isPlaying) {
            this.isPlaying = true;

            const stream = ytdl(this.videoQueue.shift(), { filter: 'audioonly', quality: 'highestaudio' });
            this.connection = await message.member.voice.channel.join();

            this.dispatcher = await this.connection.play(stream);

            this.dispatcher.on('finish', () => {
                this.dispatcher.destroy();
                this.playNextVideo();
            });

            this.dispatcher.on('error', () => {
                this.isPlaying = false;
            });

        } else {
            this.videoQueue.push(command);
            console.log("song queued:" + this.videoQueue.length);
            console.log("isPlaying:" + this.isPlaying);
        }
    }

    playNextVideo() {
        console.log(this.videoQueue);
        if (this.videoQueue.length == 0) {
            this.isPlaying = false;
            return;
        };

        this.dispatcher = this.connection.play(ytdl(this.videoQueue.shift()));
    }
}

module.exports = Play;