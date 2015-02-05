module.exports.Event = Event
module.exports.BasicEvent = BasicEvent

function Event () {}
Event.prototype = {
    
    init : function (id, type) {
        console.log("-------new_event : "+type+"------")
        this.type = type;
        this.id = id
        this.effect = []
        this.oxygen = 0
        this.speed = 0
        this.active = true
        
        //retrieve value in event desc file
        var oxygen = EVENT[this.type].oxygen
        var speed = EVENT[this.type].speed
        var effect = EVENT[this.type].effect
        
        //apply default value if exist
        if (typeof oxygen != 'undefined') this.oxygen = oxygen
        if (typeof speed != 'undefined') this.speed = speed
        if (typeof effect != 'undefined') this.effect = effect    
    },
    
    solve : function () {
        this.active = false
    },
    
    toJson : function () {
        var json = {
            'type' : this.type,
        }
        return json
    }
    
}


function BasicEvent (id, type, room_id) {
    this.init(id, type)
    this.room_id = room_id

}

BasicEvent.prototype = Event.prototype
BasicEvent.prototype.toJson = function () {
    var json = {
        'id' : this.id,
        'type' : this.type,
        'room_id' : this.room_id,
        'oxygen' : this.oxygen,
        'speed' : this.speed,
        'effect' : this.effect
    }
    return json
}

BasicEvent.prototype.applyEffect = function (spaceship) {
    spaceship.room[this.room_id].changeStatus('disabled')
}

BasicEvent.prototype.solve = function (spaceship, player_id) {
    this.active = false
    spaceship.room[this.room_id].changeStatus('enabled')
}

