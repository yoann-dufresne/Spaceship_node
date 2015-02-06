
var player = require('../player');

module.exports.Player = {
    setUp: function (callback){
        this.player = new player.Player('Firefighter');
        callback();
    },

    ctor: function (test){
        test.strictEqual(this.player.type, 'Firefighter');
        test.done();
    },

    toJson: function (test){
        test.strictEqual(this.player.toJson().type, 'Firefighter');
        test.done();
    }
};