var spec = require('./spec');

module.exports.Room = Room;

/*
 * args: type, id
 */
function Room(args) {
    console.log("-------new_room : "+args.type+"------");
    this.type = args.type;
    this.id = args.id;
    this.changeStatus(spec.DEFAULT_STATUS);
}

Room.prototype = {
    
    reset : function () {
        this.effect = [];
        this.oxygen = 0;
        this.speed = 0;
        this.status = spec.DEFAULT_STATUS;
        this.available = true;
    },
    
    changeStatus: function (status) {
        this.reset();
        this.status = status;
        
        //retrieve value in room desc file for the given status
        var oxygen = spec.ROOM[this.type].status[this.status].oxygen,
            speed = spec.ROOM[this.type].status[this.status].speed,
            effect = spec.ROOM[this.type].status[this.status].effect;
        
        //apply default value if exist
        if (typeof oxygen !== 'undefined') this.oxygen = oxygen;
        if (typeof speed !== 'undefined') this.speed = speed;
        if (typeof effect !== 'undefined') this.effect = effect;
    },
    
    toJson : function () {
        var json = {
            'type' : this.type,
            'id' : this.id,
            'status' : this.status,
            'oxygen' : this.oxygen,
            'speed' : this.speed,
            'effect' : this.effect
        };
        return json;
    }
    
}