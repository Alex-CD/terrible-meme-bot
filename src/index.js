const Discord = require('discord.js');
const client = new Discord.Client();

const Router = require('./command_router');
const PlayerManager = require('./player_manager');

require('dotenv').config({ path: __dirname + '/../../.env' });

var settings = { prefix: process.env.DEFAULT_COMMAND_PREFIX };

var playerMAnager = new PlayerManager();


process.title = process.env.PROCESS_TITLE;



//Import all modules from commands/
var commands = require('require-all')({
    dirname: __dirname + "/commands",
    resolve: function (command) {
        return new command(settings, playerMAnager);
    }
});

var router = new Router(settings, playerMAnager, commands);

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

