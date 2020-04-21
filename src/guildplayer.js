const ytpl = require('ytpl');
const ytdl = require('ytdl-core');
const ytlist = require('youtube-playlist');

class GuildPlayer {
    constructor() {
        this.videoQueue = [];
        this.state = "STOPPED";
        this.volume = 1.0;
        this.nowPlaying = "";
    }


    async queue(message, url) {

        if (ytpl.validateURL(url)) {
            var numberAdded = await this.addPlaylist(url);
            message.channel.send("Enqueued " + numberAdded + " songs");
        } else if (ytdl.validateURL(url)) {
            this.addVideo(url);
            message.channel.send("Song queued.");
        } else {
            message.channel.send("Invalid video/playlist url");
            return;
        }

        this.startPlaying(message);
    }

    async startPlaying(message) {
        if (this.state == "STOPPED" && this.hasVideos) {

            var connection = await message.member.voice.channel.join();

            this.playNext(message, connection);
        }
    }

    async interrupt(message) {
        this.state = "INTERRUPTED"
        return message.guild.me.voice.connection;
    }

    async pause(message) {
        if (this.state == "PLAYING") {
            message.guild.me.voice.dispatcher.pause(true);
            this.state = "PAUSED";
        }

        message.channel.send("Player not playing.");
    }

    async resume(message) {
        if (this.state == "PAUSED") {
            message.guild.me.voice.dispatcher.resume();
            return;
        }

        message.channel.send("Player not paused.");
    }


    async skip(message) {
        message.guild.me.voice.dispatcher.end();
    }

    async stop(message) {
        this.clearPlaylist();
        message.guid.me.voice.dispatcher.end();
        this.state = "STOPPED";
    }

    clearPlaylist() {
        this.videoQueue = [];
    }


    async info(message) {
        var info = await ytdl.getBasicInfo(toPlay);
        message.channel.send("```" + info.title + "\n" + info.description + "```");
    }

    async setVolume(message, volume){
        this.volume = volume;
        message.guild.me.voice.dispatcher.setVolume(volume);
    }


    async addPlaylist(url) {

        var list = await ytlist(url, 'url')
        var videos = list.data.playlist;

        for (var i = 0; i < videos.length; i++) {
            this.addVideo(videos[i]);
        }

        return videos.length;
    }

    async addVideo(url) {
        this.videoQueue.push(url);
    }

    nextVideo() {
        var next = this.videoQueue.shift();
        console.log("NEXTVIDEO::" + next + "\n\n");
        return next;
    }

    hasVideos() {
        return this.videoQueue.length > 0;
    }


    async playNext(message, connection) {
        if (!this.hasVideos()) {
            this.state == "STOPPED";
            return;
        };

        var toPlay = this.nextVideo();
        const stream = ytdl(toPlay, { filter: 'audioonly', quality: 'highestaudio' });
        var dispatcher = await connection.play(stream);
        this.nowPlaying = toPlay;

        this.state == "PLAYING";

        dispatcher.on('finish', () => {
            this.playNext(message, connection);
        });

        dispatcher.on('error', () => {
            this.state = "STOPPED"
        });


        var info = await ytdl.getBasicInfo(toPlay);
        message.channel.send("Now Playing: **" + info.title + "**");

    }


}

module.exports = GuildPlayer;