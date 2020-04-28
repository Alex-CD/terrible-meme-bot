const Discord = require('discord.js');
const client = new Discord.Client();

const Router = require('./command_router');
const Players = require('./players');

require('dotenv').config({ path: __dirname + '/../../.env' });

var settings = { prefix: process.env.DEFAULT_COMMAND_PREFIX };

var players = new Players();


process.title = process.env.PROCESS_TITLE;



//Import all modules from commands/
var commands = require('require-all')({
    dirname: __dirname + "/commands",
    resolve: function (command) {
        return new command(settings, players);
    }
});

var router = new Router(settings, players, commands);

client.once('ready', () => {
    console.log('Connected');
});

client.login(process.env.DISCORD_TOKEN);

client.on('message', message => {
    router.route(message, message.content);
});


process.on("SIGINT", ()=>{
    client.destroy();
    process.exit();
});

