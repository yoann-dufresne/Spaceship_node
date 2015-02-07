
var room = require('../room'),
    spec = require('../spec');

/*
 * Returns the first parameter if it's defined, else the second. 
 */
function defined_else(variable, default_){
    return (typeof variable !== 'undefined') ? variable : default_;
}


module.exports.Room = {
    setUp: function (callback){
        this.table = [];
        var id = 0;
        for (type in spec.ROOM) {
            if (spec.ROOM.hasOwnProperty(type)){
                id += 1;
                this.table.push({
                    type: type,
                    inst: new room.Room({type: type, id: id})
                });
            }
        }

        callback();
    },

    ctor: function (test){

        this.table.forEach(function (handle){

            var inst = handle.inst,
                type = handle.type,
                thatSpec = spec.ROOM[type].status[spec.DEFAULT_STATUS];

            test.strictEqual(inst.type, type);
            test.strictEqual(inst.status, spec.DEFAULT_STATUS);

            test.strictEqual(inst.oxygen, defined_else(thatSpec.oxygen, 0));
            test.strictEqual(inst.speed, defined_else(thatSpec.speed, 0));
            test.deepEqual(inst.effect, defined_else(thatSpec.effect, []));
        });
        test.done();
    },

    reset: function (test){
        this.table.forEach(function (handle){
            handle.inst.reset();
            test.strictEqual(handle.inst.type, handle.type);
            test.strictEqual(handle.inst.status, spec.DEFAULT_STATUS);
            test.strictEqual(handle.inst.oxygen, 0);
            test.strictEqual(handle.inst.speed, 0);
            test.deepEqual(handle.inst.effect, []);
        });
        test.done();
    },

    changeStatus: function (test){

        function aux(status){
        this.table.forEach(function (handle){

            var inst = handle.inst,
                type = handle.type,
                thatSpec = spec.ROOM[type].status[status];

            inst.changeStatus(status);

            test.strictEqual(inst.type, type);
            test.strictEqual(inst.status, status);

            test.strictEqual(inst.oxygen, defined_else(thatSpec.oxygen, 0));
            test.strictEqual(inst.speed, defined_else(thatSpec.speed, 0));
            test.deepEqual(inst.effect, defined_else(thatSpec.effect, []));
        }); 
        }

        aux.call(this, 'disabled');
        aux.call(this, 'enabled');

        test.done();
    },

    toJson: function (test){
        this.table.forEach(function (handle){
            var json = handle.inst.toJson();

            test.strictEqual(handle.inst.type, json.type);
            test.strictEqual(handle.inst.status, json.status);
            test.strictEqual(handle.inst.oxygen, json.oxygen);
            test.strictEqual(handle.inst.speed, json.speed);
            test.deepEqual(handle.inst.effect, json.effect);
        });
        test.done();
    }
};