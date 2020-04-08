const { AkairoClient, CommandHandler } = require('discord-akairo');

class memeClient extends AkairoClient {
    constructor() {
        super({
            // Akairo options
        }, {
            // Discord.js options
        });

        this.commandHandler = new CommandHandler(this, {
            directory: './src/commands/',
            prefix: '!'
        });

        this.commandHandler.loadAll();
    }
}

const client = new memeClient();
client.login('NjkzODM4NzM5NTUzOTEwODIw.XoC7zw.dCQ2yecsMNWCKL0HIfrMMi2gAS4');
