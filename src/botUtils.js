
exports.isUserConnected = function (message) {
    return message.member.voice.channel != null;
}

exports.isInUsersChannel = function (message) {
    return message.guild.me.voice.channel == message.member.voice.channel;
}

