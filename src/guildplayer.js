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
        if (this.state != "PLAYING" && this.hasVideos()) {

            var connection = await message.member.voice.channel.join();
            this.playNext(message, connection);
        }
    }

    async interrupt(message) {
        if (this.state == "PLAYING") {
            await this.pause(message);

            this.state = "INTERRUPTED"
            this.videoQueue.unshift(this.nowPlaying);
        }
    }

    async uninterrupt(message) {
        if (this.state == "INTERRUPTED") {
            this.state = "STOPPED"
            await this.startPlaying(message);
        }
    }

    async pause(message) {
        if (this.state == "PLAYING") {
            var connection = await this.getConnection(message);
            await connection.dispatcher.pause();
            this.state = "PAUSED";
        }
    }

    async resume(message) {
        if (this.state == "PAUSED") {
            var connection = await this.getConnection(message);
            await connection.dispatcher.resume();

            this.state = "PLAYING";
            return;
        }

        message.channel.send("Player not paused.");
    }

    async getConnection(message) {
        var thisConnection = await message.client.voice.connections.filter((connection) => {
            return connection.channel.id === message.guild.me.voice.channel.id;
        });

        return thisConnection.first();
    }


    async skip(message) {
        var connection = await this.getConnection(message);
        await connection.dispatcher.end();

        if(this.state == "PAUSED"){
            this.startPlaying(message);
        }
    }

    async stop(message) {
        if (this.state !== "STOPPED") {
            this.clearPlaylist();
            this.state = "STOPPED";
            var connection = await this.getConnection(message);

            if(connection.dispatcher){
                await connection.dispatcher.end();
            }
            
        }
    }

    clearPlaylist() {
        this.videoQueue = [];
    }

    async setVolume(message, volume) {


        if(volume < 0.1 || volume > 100) return;

        this.volume = volume;
        var connection = await this.getConnection(message);
        if(connection.dispatcher != undefined){
            await connection.dispatcher.setVolume(volume);
        }


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
        dispatcher.setVolume(this.volume);
        this.nowPlaying = toPlay;

        this.state = "PLAYING";

        dispatcher.on('finish', () => {
            if (this.state != "INTERRUPTED") {
                this.playNext(message, connection);
            }

            this.state = "STOPPED";
        });

        dispatcher.on('error', () => {
            this.state = "STOPPED"
        });


       

    }

    async printSongInfo(message){
        var info = await ytdl.getBasicInfo(this.nowPlaying);

        var length = this.makeVideoLengthReadable(info.length_seconds);

        var songInfoString = info.title + "\n" + length;
        message.channel.send("```Now Playing:\n" + songInfoString + "```");
    }

    makeVideoLengthReadable(lengthSeconds){
        var minutes = Math.floor(lengthSeconds / 60);
        var seconds = lengthSeconds % 60;

        if(seconds < 10){
            seconds = "0" + seconds;
        }

        return minutes + ":" + seconds;
    }
    

}

module.exports = GuildPlayer;