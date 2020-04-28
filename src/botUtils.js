
exports.isUserConnected = function (message) {
    return message.member.voice.channel != null;
}

exports.isBotInUsersChannel = function (message) {
    return message.guild.me.voice.channel == message.member.voice.channel;
}

exports.isBotConnectedToGuild = function(message){
    return message.guild.me.voice.channel != null;
}