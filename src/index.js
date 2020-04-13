const Discord = require('discord.js');
const client = new Discord.Client();

var settings = { prefix: process.env.DEFAULT_COMMAND_PREFIX };

console.log(process.env.DISCORD_TOKEN);
client.once('ready', () => {
    console.log('Ready!');
});

client.login(process.env.DISCORD_TOKEN);

client.on('message', message => {
    // Ignore messages that don't start with a prefix, or that come from another bot
    console.log("message");
    if (!message.content.startsWith(settings.prefix) || message.author.bot) return;

    console.log("Command received: " + message.content.slice(1));
});



