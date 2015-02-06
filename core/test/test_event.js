
var eventModule = require('../event');
var spec = require('../spec');
var spaceship = require('../spaceship');

module.exports.Event = {
    
    ctor: function (test){

        // create a table with all event types
        var typeTable = [];
        for (type in spec.EVENT){
            if (spec.EVENT.hasOwnProperty(type)){
                typeTable.push(type);
            }
        }

        // do some tests for each type
        typeTable.forEach(function (type){

                var e = new eventModule.Event(2, type);

                // values passed to the ctor 
                test.strictEqual(e.id, 2, 'wrong Event.id');
                test.strictEqual(e.type, type, 'wrong Event.type');

                // should be default or specs values
                if (spec.EVENT[type].oxygen === undefined){
                    test.strictEqual(e.oxygen, 0, 'oxygen should be default value');
                } else {
                    test.strictEqual(e.oxygen, spec.EVENT[type].oxygen, 'wrong Event.oxygen');
                }

                if (spec.EVENT[type].speed === undefined){
                    test.strictEqual(e.speed, 0, 'speed should be default value');
                } else {
                    test.strictEqual(e.speed, spec.EVENT[type].speed, 'wrong Event.speed');
                }

                if (spec.EVENT[type].effect === undefined){
                    test.deepEqual(e.effect, [], 'effect should be default value');
                } else {
                    test.deepEqual(e.effect, spec.EVENT[type].effect, 'wrong Event.effect');
                }

                // active after initialization
                test.ok(e.active, 'active should be true after initialization');
            });

        test.done();
    },

    solve: function (test){
        var e = new eventModule.Event(1, 'Fire');

        e.solve();
        test.ok(!e.active, 'active should be false after solve()');

        test.done();
    },

    toJson: function (test){
        var e = new eventModule.Event(1, 'Fire');

        var json = e.toJson();

        test.deepEqual(e.toJson(), {
            id: e.id,
            type: e.type,
            oxygen: e.oxygen,
            speed: e.speed,
            effect: e.effect
        }, "toJson() doesn't return the corresponding object");

        test.done();
    }
};

module.exports.BasicEvent = {

    setUp: function (callback){
        console.log('setup')
        this.spaceship = new spaceship.Spaceship();
        this.spaceship.addRoom('CommandCenter');
        this.e = new eventModule.BasicEvent(42, 'Alien', 0);
        callback();
        console.log('setup end')

    },

    tearDown: function(callback){
        callback();
    },

    ctor: function (test){
        var e = this.e;
        var type = 'Alien';

        test.strictEqual(e.id, 42, 'wrong Event.id');
        test.strictEqual(e.type, 'Alien', 'wrong Event.type');

        // should be default or specs values
        if (spec.EVENT[type].oxygen === undefined){
            test.strictEqual(e.oxygen, 0, 'oxygen should be default value');
        } else {
            test.strictEqual(e.oxygen, spec.EVENT[type].oxygen, 'wrong Event.oxygen');
        }

        if (spec.EVENT[type].speed === undefined){
            test.strictEqual(e.speed, 0, 'speed should be default value');
        } else {
            test.strictEqual(e.speed, spec.EVENT[type].speed, 'wrong Event.speed');
        }

        if (spec.EVENT[type].effect === undefined){
            test.deepEqual(e.effect, [], 'effect should be default value');
        } else {
            test.deepEqual(e.effect, spec.EVENT[type].effect, 'wrong Event.effect');
        }

        test.strictEqual(e.room_id, 0, 'incorrect room_id');

        test.done();
    },

    applyEffect: function (test){

        this.e.applyEffect(this.spaceship);
        test.strictEqual(this.spaceship.room[this.e.room_id].status, 'disabled');
        test.done();
    },

    solve: function(test){
        this.e.applyEffect(this.spaceship);
        this.e.solve(this.spaceship, null); // null = player_id (not used by solve() at that time)
        test.ok(!this.active);
        test.strictEqual(this.spaceship.room[this.e.room_id].status, 'enabled');
        test.done();
    },

    toJson: function (test){
        
        var e = this.e;
        var json = e.toJson();

        test.deepEqual(e.toJson(), {
            id: e.id,
            type: e.type,
            oxygen: e.oxygen,
            speed: e.speed,
            effect: e.effect,
            room_id: e.room_id,
        }, "toJson() doesn't return the corresponding object");

        test.done();
    }
};