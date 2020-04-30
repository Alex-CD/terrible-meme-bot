class MessageStub {

    constructor(settings){
        var defaultVals = {
            contents : "!test Hello world",
            type : "text",
            author : "1234",
            bot : false,
            channel : "12345"
        }

        // Replacing default values with passed settings, if they exist
        var params = Object.assign(defaultVals, settings);

        this.sentMessages = [];
        this.contents = params.contents;
        this.channel = { type : params.type, send : function(string){ this.sentMessages.push(string); } };
        this.author = { id: params.author, bot : params.bot};
        this.member = { voice : { channel : params.channel } };
    }
}

module.exports = MessageStub;