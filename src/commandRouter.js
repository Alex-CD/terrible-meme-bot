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

        var commandText = this.removeSpaces(message.content);
        var trimmedCommand = this.trimCommand(commandText)

        for (var i = 0; i < this.commands.length; i++) {
            if (message.content.split(' ')[0] == this.settings.prefix + this.commands[i].command) {
                this.commands[i].run(trimmedCommand, message);
            }
        }
    }
    
    // Removes leading, trailing, and duplicate spaces
    removeSpaces(string){
        var split = string.split(' ');
        var out = "";

        for(var i = 0; i < split.length; i++){
            if(split[i].length > 0){
                out += split[i] + ' ';
            }
        }

        return out.slice(0,-1);
    }

    // Removes the initial command (e.g '!set sometext' -> 'sometext' from a string
    trimCommand(contents){
        
        if(contents.split(' ').length == 1) return "";
        return contents.split(/ (.+)/)[1];
    }
}



module.exports = commandParser;