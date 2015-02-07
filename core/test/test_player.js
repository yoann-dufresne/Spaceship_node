
var player = require('../player');

module.exports.Player = {
    setUp: function (callback){
        this.player = new player.Player({type: 'Firefighter', id: 0});
        callback();
    },

    ctor: function (test){
        test.strictEqual(this.player.type, 'Firefighter');
        test.strictEqual(this.player.id, 0);
        test.done();
    },

    toJson: function (test){
        test.strictEqual(this.player.toJson().type, 'Firefighter');
        test.strictEqual(this.player.toJson().id, 0);
        test.done();
    }
};