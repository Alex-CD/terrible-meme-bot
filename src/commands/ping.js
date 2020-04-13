class Ping {
    constructor(){
        this.command = "ping";
    }

    run(command, message){
        var diff = Date.now() - message.createdAt;
        message.channel.send("Pong: " + diff + "ms");
    }
}

module.exports = Ping;