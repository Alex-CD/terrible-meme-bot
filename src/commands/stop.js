class Stop {
    constructor(){
        this.aliases = ["stop"];
    }

    async run(command, message){
        await message.client.voice.connections.each((connection)=> {
            connection.dispatcher.pause();
        });
    }
}

module.exports = Stop;