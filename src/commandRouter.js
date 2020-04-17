const Ping = require('./commands/ping');
const Set = require('./commands/set');
const Stop = require('./commands/stop');
const RussianRoulette = require('./commands/russianroulette');
const PlayLocal = require('./commands/playLocal');

class commandParser {

    constructor(settings) {
        this.settings = settings;
        this.commands = [
            new Ping(),
            new Set(),
            new RussianRoulette(),
            new PlayLocal(),
            new Stop()];
    }

    route(message) {
        // Ignore messages that don't start with a prefix, or that come from another bot
        if (!message.content.startsWith(this.settings.prefix) || message.author.bot) return;
        
        var command = message.content.split(' ')[0];
        var trimmedCommand = this.trimCommand(this.removeSpaces(message.content));


        // Loop through commands, loop through command aliases to try to match requested
        for (var c = 0; c < this.commands.length; c++) {
            for (var a = 0; a < this.commands[c].aliases.length; a++) {
                if (command == this.settings.prefix + this.commands[c].aliases[a]) {
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