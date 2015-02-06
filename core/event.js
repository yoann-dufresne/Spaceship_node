var spec = require('./spec');

module.exports.Event = Event;
module.exports.BasicEvent = BasicEvent;

function Event (id, type) {

    this.init(id, type);
}

Event.prototype = {
    
    init : function (id, type) {
        console.log("-------new_event : "+type+"------");
        this.type = type;
        this.id = id;
        this.effect = [];
        this.oxygen = 0;
        this.speed = 0;
        this.active = true;
        
        //retrieve value in event desc file
        var oxygen = spec.EVENT[this.type].oxygen,
            speed = spec.EVENT[this.type].speed,
            effect = spec.EVENT[this.type].effect;
        
        //apply default value if exist
        if (typeof oxygen != 'undefined') this.oxygen = oxygen;
        if (typeof speed != 'undefined') this.speed = speed;
        if (typeof effect != 'undefined') this.effect = effect;    
    },
    
    solve : function () {
        this.active = false;
    },
    
    // toJson() doesn't not return json string, but jsonable object.
    toJson : function () {
        var json = {
            'id' : this.id,
            'type' : this.type,
            'oxygen' : this.oxygen,
            'speed' : this.speed,
            'effect' : this.effect
        };
        return json;
    }
    
}

function BasicEvent (id, type, room_id) {

    // call the Event constructor. I think is cleaner than call the init() method.
    Event.call(this, id, type);

    this.room_id = room_id
}

BasicEvent.prototype = Object.create(Event.prototype);
// if we assign directly Event.prototype, every modifications done to BasicEvent.prototype
//   are propagated to Event. So, first copy it. 

BasicEvent.prototype.toJson = function () {

    // call the super toJson method
    var json = Event.prototype.toJson.call(this);
 
    // extend it
    json.room_id = this.room_id;

    return json;
}

BasicEvent.prototype.applyEffect = function (spaceship) {
    if (this.active){
        spaceship.room[this.room_id].changeStatus('disabled');
    }
}

BasicEvent.prototype.solve = function (spaceship, player_id) {
    this.active = false
    spaceship.room[this.room_id].changeStatus('enabled')
}

