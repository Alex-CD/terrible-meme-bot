const Ping = require('./commands/ping');
const Set = require('./commands/set');

class commandParser {

    constructor(settings) {
        this.settings = settings;
        this.commands = [new Ping(), new Set()];
    }

    route(message) {
        // Ignore messages that don't start with a prefix, or that come from another bot
        if (!message.content.startsWith(this.settings.prefix) || message.author.bot) return;



        for (var i = 0; i < this.commands.length; i++) {
            if (message.content.split(' ')[0] == this.settings.prefix + this.commands[i].command) {
                console.log("command recognised:" + this.commands[i].command)
            }
        }
    }
}



module.exports = commandParser;