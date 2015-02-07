
var spaceship = require('../spaceship'),
    spec = require('../spec'),
    event = require('../event');

module.exports = {

    setUp: function (callback){

        this.spaceship = new spaceship.Spaceship();

        callback();
    },

    ctor: function (test){
        test.strictEqual(this.spaceship.oxygen, 100);
        test.strictEqual(this.spaceship.time_left, this.spaceship.initialTimeLeft);
        test.strictEqual(this.spaceship.status, 'stoped');
        test.deepEqual(this.spaceship.room, []);
        test.deepEqual(this.spaceship.event, []);
        test.deepEqual(this.spaceship.player, []);
        test.strictEqual(this.spaceship.current_speed, 0);
        test.strictEqual(this.spaceship.delta_oxygen, 0);
        test.done();
    },


    addRoom: function (test){

        var type1 = Object.keys(spec.ROOM)[0],
            type2 = Object.keys(spec.ROOM)[1];

        this.spaceship.addRoom(type1);
        this.spaceship.addRoom(type2);

        function aux(type){
            test.strictEqual(
                this.spaceship.room.filter(function (room){
                    return room.type === type;
                }).length, 1);
        }

        test.strictEqual(this.spaceship.room.length, 2);
        aux.call(this, type1);
        aux.call(this, type2);

        test.done();
    },

    addPlayer: function (test){

        var type1 = 'Firefighter', type2 = 'Engineer';

        this.spaceship.addPlayer(type1);
        this.spaceship.addPlayer(type2);

        function aux(type){
            test.strictEqual(
                this.spaceship.player.filter(function (player){
                    return player.type === type;
                }).length, 1);
        }

        test.strictEqual(this.spaceship.player.length, 2);
        aux.call(this, type1);
        aux.call(this, type2);

        test.done();
    },

    addEvent: function (test){

        this.spaceship.addRoom('Computer'); // room ID should be 0
        test.ok(typeof this.spaceship.room[0] != 'undefined');

        this.spaceship.addEvent('Fire');

        test.strictEqual(this.spaceship.event.length, 1);
        test.strictEqual(this.spaceship.room[0].status, 'disabled');

        test.done();
    },

    toto: function (test){

        console.log('spec.EVENT = ' + spec.EVENT);

        this.spaceship.addRoom('Computer');
        this.spaceship.addEvent('Fire');
        test.strictEqual()

        this.spaceship.status = 'active'; // manually active.
        this.spaceship.update();

        this.spaceship.addRoom('Cockpit');
        this.spaceship.update();

        test.deepEqual(this.spaceship.effect, ['randomFailure']);
        test.strictEqual(this.spaceship.delta_oxygen, -1);
        test.strictEqual(this.spaceship.oxygen, 98);
        test.strictEqual(this.spaceship.current_speed, 0.5);
        test.strictEqual(this.spaceship.time_left, this.spaceship.initialTimeLeft - 0.5);

        test.done();
    },

    startAndStop: function (test){

        var that = this;

        // override update() method to see what happens behind the scene
        this.spaceship.update = function () {
            test.strictEqual(that.spaceship.status, 'active');
            that.counter += 1;
            if (that.counter == 3) {
                that.spaceship.stop();
            }
        }

        // accelerate the tests
        this.spaceship.updateIntervalDelay = 10; 

        test.expect(3);
        this.counter = 0;
        this.spaceship.start();

        setTimeout(function() {
            test.done();
        }, 5 * this.spaceship.updateIntervalDelay);
    },

    toJson: function (test){

        var json = this.spaceship.toJson();

        function testProperty(name, func){
            if (typeof func == 'undefined'){
                func = test.strictEqual;
            }
            func(json[name], this.spaceship[name]);
        }

        testProperty.call(this, 'satus');
        testProperty.call(this, 'oxygen');
        testProperty.call(this, 'time_left');
        testProperty.call(this, 'current_speed');
        testProperty.call(this, 'delta_oxygen');
        testProperty.call(this, 'room', test.deepEqual);
        testProperty.call(this, 'player', test.deepEqual);
        testProperty.call(this, 'event', test.deepEqual);

        test.done();
    }
};
