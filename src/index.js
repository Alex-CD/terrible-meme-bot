const Discord = require('discord.js');
const client = new Discord.Client();

const Router = require('./commandRouter');

var settings = { prefix: process.env.DEFAULT_COMMAND_PREFIX };


var router = new Router(settings);
client.once('ready', () => {
    console.log('Connected');
});

client.login(process.env.DISCORD_TOKEN);

client.on('message', message => {
    router.route(message);
});



