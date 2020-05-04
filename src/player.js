var AudioQueue = require('./audio_queue');

const ytdl = require('ytdl-core');

class GuildPlayer {
    constructor(idleDisconnectDelayMinutes) {
        this.idleDisconnectDelayMS = idleDisconnectDelayMinutes * 60 * 1000;
        this.audioQueue = new AudioQueue();
        
        this.lastFinishTime = Date.now();

        this.isPlaying = false;
        this.isPaused = false;

        this.volume = 1.0;
        this.nowPlaying = { url: "", source: "" };
    }

    async play(message, url, source) {

        if (this.isPaused) {
            this.stop(message);
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


        if (!this.isPlaying) {
            var connection = await message.member.voice.channel.join();
            await this.playNext(message, connection);
            return;
        }
    }

    async interrupt(message, url, source) {
        if (this.isPlaying && !this.isPaused) {

            // !v requeues non-local clips
            if (this.nowPlaying.source != "LOCAL") {
                this.audioQueue.jumpQueue(this.nowPlaying.url, this.nowPlaying.source);
            }

            this.audioQueue.jumpQueue(url, source);
            await this.skip(message);
        } else {
            this.play(message, url, source);
        }
    }

    async pause(message) {
        if (this.isPlaying && !this.isPaused) {
            var connection = await this.getConnection(message);
            await connection.dispatcher.pause();

            this.isPaused = true;
        }
    }

    async resume(message) {
        if (this.isPlaying && this.isPaused) {
            var connection = await this.getConnection(message);
            if (connection) {
                await connection.dispatcher.resume();

                this.isPaused = false;
            }

            return;
        }

        message.channel.send("Player is not paused.");
    }

    async getConnection(message) {
        var thisConnection = await message.client.voice.connections.filter((connection) => {
            return connection.channel.id === message.guild.me.voice.channel.id;
        });

        return thisConnection.first();
    }


    async skip(message) {
        if (this.isPlaying || this.isPaused) {
            var connection = await this.getConnection(message);
            await connection.dispatcher.end();
        }
    }

    async stop(message) {
        this.audioQueue.clear();
        this.isPlaying = false;
        this.isPaused = false;

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
            this.isPlaying = false;
            this.isPaused = false;
            this.waitToDisconnect(message)
            return;
        };


        var toPlay = this.audioQueue.get();

        this.nowPlaying.url = toPlay.url;
        this.nowPlaying.source = toPlay.source;

        this.isPlaying = true;
        this.isPaused = false;

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
        dispatcher.setVolume(this.volume);

        dispatcher.on('finish', async () => {
            this.playNext(message, connection);
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

    async waitToDisconnect(message) {
        var thisFinishTime = Date.now();
        this.lastFinishTime = thisFinishTime;

        var parent = this;

        // Check every second if bot should disconnect, or stop waiting
        var interval = setInterval(function () {
            if(thisFinishTime != parent.lastFinishTime || parent.isPlaying){
                clearInterval(interval);
                return;
            }

            if((Date.now() - thisFinishTime) > parent.idleDisconnectDelayMS) {
                message.guild.me.voice.setChannel(null, "bot is idle - disconnecting.");
                clearInterval(interval);
                return;
            }
        }, 1000);
    }
}

module.exports = GuildPlayer;