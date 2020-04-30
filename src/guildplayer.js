
var audio_queue = require('./audio_queue');

const ytdl = require('ytdl-core');

class GuildPlayer {
    constructor() {
        this.audioQueue = new audio_queue();
        this.state = "STOPPED";
        this.volume = 1.0;
        this.nowPlaying = { url: "", source: "" };
    }


    async play(message, url, source) {

        if (message == "") {
            this.resume();
        }

        var videosQueued = await this.audioQueue.add(url, source);


        if (source == "YOUTUBE") {
            switch (true) {
                case videosQueued == 0:
                    message.channel.send("Error fetching playlist. Sorry! This is a bug with youtube." +
                        "Rerequesting the playlist usually works.");
                    return;
                case videosQueued == 1:
                    message.channel.send("Song queued.");
                    break;
                case videosQueued > 1:
                    message.channel.send("Enqueued " + videosQueued + " songs");
                    break;
                default:
                    message.channel.send("Invalid video/playlist url");
                    return;
            }
        }


        if (this.state == "PAUSED") {
            this.audioQueue.clear();
            var connection = await message.member.voice.channel.join();
            this.playNext(message, connection);
            return;
        }

        if (this.state == "STOPPED") {
            var connection = await message.member.voice.channel.join();
            this.playNext(message, connection);
            return;
        }
    }

    async interrupt(message, url, source) {
        if (this.state == "PLAYING") {
            if (this.nowPlaying.source != "LOCAL") {
                this.audioQueue.jumpQueue(this.nowPlaying.url, this.nowPlaying.source);
            }

            this.audioQueue.jumpQueue(url, source);
            await this.skip(message);
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

        if (this.state == "PAUSED") {
            this.startPlaying(message);
        }
    }

    async stop(message) {

        if (this.state == "INTERRUPTED") {
            var connection = await this.getConnection(message);
            await connection.dispatcher.end();
            return;
        }

        this.audioQueue.clear();
        this.state = "STOPPED";

        var connection = await this.getConnection(message);
        if (connection.dispatcher) {
            await connection.dispatcher.end();
        }
    }

    async setVolume(message, volume) {

        if (volume < 0.1 || volume > 100) return;

        this.volume = volume;
        var connection = await this.getConnection(message);
        if (connection.dispatcher != undefined) {
            await connection.dispatcher.setVolume(volume);
        }
    }

    async playNext(message, connection) {
        
        if (this.audioQueue.isEmpty()) {
            this.state == "STOPPED";
            return;
        };

    
        var toPlay = this.audioQueue.get();

        this.nowPlaying.url = toPlay.url;
        this.nowPlaying.source = toPlay.source;

        console.log(this.nowPlaying.url + this.nowPlaying.source + this.state);
        this.state = "PLAYING";

        switch (toPlay.source) {
            case "YOUTUBE":
                await this.playYoutubeVideo(message, toPlay.url, connection);
                break;
            case "LOCAL":
                await this.playLocal(message, toPlay.url, connection);
                break;
            default:
                return;
        }
    }

    async playYoutubeVideo(message, url, connection) {
        const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
        var dispatcher = await connection.play(stream);
        dispatcher.setVolume(this.volume);

        this.nowPlaying.source = "YOUTUBE";
        this.printSongInfo(message);

        dispatcher.on('finish', () => {
            this.playNext(message, connection);
        });

        dispatcher.on('error', () => {
            this.playNext(message, connection);
        });
    }

    async playLocal(message, url, connection) {
        var dispatcher = await connection.play(url);
        dispatcher.on('finish', async () => {
            this.playNext(message, connection)
        });

        dispatcher.on('error', async () => {
            this.playNext(message, connection)
        });
    }



    async printSongInfo(message) {
        var info = await ytdl.getBasicInfo(this.nowPlaying.url);

        var length = this.makeVideoLengthReadable(info.length_seconds);

        var songInfoString = info.title + "\n" + length;
        message.channel.send("```Now Playing:\n" + songInfoString + "```");
    }

    makeVideoLengthReadable(lengthSeconds) {
        var minutes = Math.floor(lengthSeconds / 60);
        var seconds = lengthSeconds % 60;

        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        return minutes + ":" + seconds;
    }
}

module.exports = GuildPlayer;