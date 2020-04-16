const Ping = require('./commands/ping');
const Set = require('./commands/set');
const RussianRoulette = require('./commands/russianroulette');

class commandParser {

    constructor(settings, voiceConnections) {
        this.settings = settings;
        this.commands = [
            new Ping(),
            new Set(),
            new RussianRoulette()];
    }

    route(message) {
        // Ignore messages that don't start with a prefix, or that come from another bot
        if (!message.content.startsWith(this.settings.prefix) || message.author.bot) return;
        
        var command = message.content.split(' ')[0];
        var trimmedCommand = this.trimCommand(this.removeSpaces(message.content));

    
        for (var c = 0; c < this.commands.length; c++) {
            for (var a = 0; a < this.commands[c].aliases.length; a++) {
                console.log(command);
                if (command == this.settings.prefix + this.commands[c].aliases[a]) {
                    console.log(this.commands[c].aliases.length + this.commands[c].aliases[a]);
                    this.commands[c].run(trimmedCommand, message);
                }
            }
        }
    }

    // Removes leading, trailing, and duplicate spaces
    removeSpaces(string) {
        var split = string.split(' ');
        var out = "";

        for (var i = 0; i < split.length; i++) {
            if (split[i].length > 0) {
                out += split[i] + ' ';
            }
        }

        return out.slice(0, -1);
    }

    // Removes the initial command (e.g '!set sometext' -> 'sometext' from a string
    trimCommand(contents) {

        if (contents.split(' ').length == 1) return "";
        return contents.split(/ (.+)/)[1];
    }
}



module.exports = commandParser;