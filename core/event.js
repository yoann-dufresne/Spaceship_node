 var spec = require('./spec');

module.exports.Event = Event;
module.exports.BasicEvent = BasicEvent;

/*
 * args : type, id, spaceship
 */
function Event (args) {

    this.init(args.type, args.id, args.spaceship);
}

Event.prototype = {
    
    init : function (type, id, spaceship) {
        console.log("-------new_event : "+type+"------");
        this.type = type;
        this.id = id;
        this.spaceship = spaceship;
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

/*
 * args : type, id, spaceship
 */
function BasicEvent (args) {

    // call the Event constructor. I think is cleaner than call the init() method.
    Event.call(this, args);
    
    //select a room among available one
    var rooms = this.spaceship.getAvailableRoom();
    
    //if not enough available room for this event
    //active -> false will remove it 
    if (rooms.length < 1) {
        this.active = false
    }else{
        this.room_id = rooms[Math.floor(Math.random()*rooms.length)];
        this.applyEffect()
    }
}

BasicEvent.prototype = Object.create(Event.prototype);
// if we assign directly Event.prototype, every modifications done to BasicEvent.prototype
//   are propagated to Event. So, first copy it. 

BasicEvent.prototype.toJson = function () {

    // call the super toJson method
    var json = Event.prototype.toJson.call(this);
 
    // extend it
    json.room_id = this.spaceship.getAvailableRoom();

    return json;
}

BasicEvent.prototype.applyEffect = function () {
    if (this.active){
        this.spaceship.room[this.room_id].changeStatus('disabled');
        this.spaceship.room[this.room_id].available = false;
    }
}

BasicEvent.prototype.solve = function (player_id) {
    this.active = false
    this.spaceship.room[this.room_id].changeStatus('enabled')
    this.spaceship.room[this.room_id].available = true;
}

