class CommandStub {
    constructor(aliases){
        this.aliases = aliases;
        this.hasRun = false;
        this.hasRunHelp = false;
    }


    async run(command, message) {
        this.hasRun = true;
    }

    async help(command, message){
        this.hasRunHelp = true;
    }
}

module.exports = CommandStub;