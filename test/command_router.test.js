var assert = require('chai').assert;
const Router = require('../src/command_router');

const CommandStub = require('./stubs/command_stub');
const MessageStub = require('./stubs/message_stub');
const PlayerManagerStub = require('./stubs/player_manager_stub');

describe("command_router", function(){
    var players;


    beforeEach(function(){
        players = new PlayerManagerStub();
    });

    describe("#route", function(){

        it("should accept a string command", function(){
            var router = new Router({}, players, {});
            router.route(new MessageStub({ contents : "Hi world!"}), "Hi world!");
        });

        it("should identify and run the correct command", function(){
            var commands = { "test1" : new CommandStub(["test1"]), "test2" : new CommandStub(["test2"]) };

            var router = new Router({ prefix: '!'}, players, commands);

            router.route(new MessageStub(), "!test1");

            assert( commands.test1.hasRun, "the correct command should have run")
            assert( !commands.test2.hasRun, "the incorrect command should not have run");
        });

        it("should reject commands without a prefix", function(){

            var commands = { "test1" : new CommandStub(["test"]) };
            var router = new Router({ prefix: '!'}, players, commands);

            router.route(new MessageStub(), "test this has no prefix");

            assert( !commands.test1.hasRun, "the command should have not run");
        });

        it("should reject commands from a bot, or that are a PM", function(){

        });

    });

    describe("#removeSpaces", function(){

        var router = new Router({ prefix: '!'}, players, {});

        it("should remove leading spaces", function(){
            assert(router.removeSpaces(" Hi World") === "Hi World", "leading spaces should have been removed");
        });

        it("should remove trailing spaces", function(){
            assert(router.removeSpaces("Hi World   ") === "Hi World", "trailing spaces should have been removed");
        });

        it("should remove extra spaces within a message", function(){
            assert(router.removeSpaces("Hi   World") === "Hi World", "extra spaces should have been removed");
        });

        it("should leave a string with no extra spaces unchanged", function(){

            assert(router.removeSpaces("Hi World this is a test") === "Hi World this is a test")
        });
    });

    describe("#trimCommand", function(){

        var router = new Router({ prefix: '!'}, players, {});

        it("should remove the command from a string, leaving the arguments", function(){
            assert(router.trimCommand("!test hiworld") === "hiworld", "removed the prefix ('!example') from the message");
        });

        it("should be able to tolerate empty strings", function(){
            assert(router.trimCommand("") === "", "return empty string without erroring");
        });
    });
});