module.exports.Room = Room

function Room(type) {
    console.log("-------new_room : "+type+"------")
    this.type = type
    this.changeStatus(DEFAULT_STATUS)
}

Room.prototype = {
    
    reset : function () {
        this.effect = []
        this.oxygen = 0
        this.speed = 0
        this.status = DEFAULT_STATUS
    },
    
    changeStatus: function (status) {
        this.reset();
        this.status = status
        
        //retrieve value in room desc file for the given status
        var oxygen = ROOM[this.type].status[this.status].oxygen
        var speed = ROOM[this.type].status[this.status].speed
        var effect = ROOM[this.type].status[this.status].effect
        
        //apply default value if exist
        if (typeof oxygen != 'undefined') this.oxygen = oxygen
        if (typeof speed != 'undefined') this.speed = speed
        if (typeof effect != 'undefined') this.effect = effect       
    },
    
    toJson : function () {
        var json = {
            'type' : this.type,
            'status' : this.status,
            'oxygen' : this.oxygen,
            'speed' : this.speed,
            'effect' : this.effect
        }
        return json
    }
    
}