var assert = require('chai').assert;
const Router = require('../src/command_router');

const CommandStub = require('./stubs/command_stub');
const MessageStub = require('./stubs/message_stub');
const PlayersStub = require('./stubs/players_stub');

describe("command_router", function(){
    var players;


    beforeEach(function(){
        players = new PlayersStub();
    });

    describe("#route", function(){

        it("should accept a string command", function(){
            var router = new Router({}, players, {});
            router.route(new MessageStub({ contents : "Hi world!"}), "Hi world!");
        });
{}
        it("should reject commands without a prefix", function(){

            var commands = { "test1" : new CommandStub(["test"]) };
            var router = new Router({ prefix: '!'}, players, commands);

            router.route(new MessageStub(), "test this has no prefix");

            assert( !commands.test1.hasRun, "the command should have not run");
        });
    });

});