var assert = require('chai').assert;

const Player = require('../src/player');

const CommandStub = require('./stubs/command_stub');
const MessageStub = require('./stubs/message_stub');
const PlayerManagerStub = require('./stubs/player_manager_stub');

describe("player", function(){

    var guildPlayer;


    beforeEach(function(){
        player = new Player();
    });


    describe("#playNext", function(){
        
    });

    describe("#pause", function(){

    });

    describe("#play", function(){

    });

    describe("#waitToLeave", function(){
        it("should disconnect the bot if the bot waits for long enough", function(){
            player = new Player(0.5);
            player.waitToDisconnect();
        })
    });


});