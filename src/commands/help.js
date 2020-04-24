class Help {
    constructor(){
        this.aliases = ["help", "commands"];
    }

    run(command, message){
        message.channel.send("Available commands: !help, !info, !play, !pause, !skip, !stop, !v, !volume, !russianroulette")
    }
}

module.exports = Help;