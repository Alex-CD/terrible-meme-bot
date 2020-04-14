var random = require('random');

class RussianRoulette {
    constructor(){
        this.command = "russianroulette";
    }

    async run(command, message){

        var channel = message.guild.member(message.author).voice.channel;

        if(!channel){
            await message.channel.send("You need to be connected to a voice channel to use this command.");
            return;
        }

        var userToDisconnect = message.guild.member(channel.members.keyArray()[random.int(0, users.length - 1)]);

        await userToDisconnect.voice.setChannel(null, "Failed the russian roulette.");
    }
}

module.exports = RussianRoulette;