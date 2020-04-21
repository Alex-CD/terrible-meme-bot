const Discord = require('discord.js');
const client = new Discord.Client();

const Router = require('./commandRouter');
const Players = require('./players');

var settings = { prefix: process.env.DEFAULT_COMMAND_PREFIX };



var players = new Players();



var router = new Router(settings, players);

client.once('ready', () => {
    console.log('Connected');
});

client.login(process.env.DISCORD_TOKEN);

client.on('message', message => {
    router.route(message);
});


process.on("SIGINT", ()=>{
    client.destroy();
})

