class Restart {
    constructor(){
        this.aliases = ["restart"];
    }

    run(command, message){
        process.kill(process.pid, "SIGINT");
    }
}

module.exports = Restart;