module.exports.Event = Event;
module.exports.BasicEvent = BasicEvent;
module.exports.AlienEvent = AlienEvent;

var spec = require('./spec');

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
		this.start = this.spaceship.log.time;
        
        //retrieve value in event desc file
        var oxygen = spec.EVENT[this.type].oxygen,
            speed = spec.EVENT[this.type].speed,
            effect = spec.EVENT[this.type].effect;
        
        //apply default value if exist
        if (typeof oxygen != 'undefined') this.oxygen = oxygen;
        if (typeof speed != 'undefined') this.speed = speed;
        if (typeof effect != 'undefined') this.effect = effect;    
    },
    
    solve : function (player_id) {
		//TODO save player_id in game log
		console.log("> solve event : "+this.type);
		this.active = false;
		this.stop = this.spaceship.log.time;
    },
    
    // toJson() doesn't not return json string, but jsonable object.
    toJson : function () {
        var json = {
            'id' : this.id,
            'type' : this.type,
            'oxygen' : this.oxygen,
            'speed' : this.speed,
            'effect' : this.effect,
            'start' : this.start,
			'room_id': this.room_id,
			'active': this.active,
			'stop' : this.stop
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
        this.active = false;
    }else{
        this.room_id = rooms[Math.floor(Math.random()*rooms.length)];
        this.applyEffect();
    }
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

BasicEvent.prototype.applyEffect = function () {
	this.spaceship.room[this.room_id].changeStatus('disabled');
	this.spaceship.room[this.room_id].available = false;
}












function AlienEvent (args) {
    Event.call(this, args);
    
    //select a room among available one
    var rooms = this.spaceship.getAvailableRoom();
    
	if (typeof args.arg != "undefined")
		this.arg = args.arg;
	
    //if not enough available room for this event
    //active -> false will remove it 
    if (rooms.length < 1) {
        this.active = false;
    }else{
        this.room_id = rooms[Math.floor(Math.random()*rooms.length)];
        this.applyEffect();
    }
}

AlienEvent.prototype = Object.create(BasicEvent.prototype);

AlienEvent.prototype.solve = function (player_id, query) {
	console.log("> solve event : "+this.type);
	if (typeof query != 'undefined'){
		var json_arg = JSON.parse(decodeURIComponent(query.arg));
		if (json_arg.length != 0) 
			this.spaceship.addEvent(this.type, json_arg);
	}
	this.active = false;
	this.stop = this.spaceship.log.time;
}

AlienEvent.prototype.toJson = function () {
	var json = BasicEvent.prototype.toJson.call(this);
 
	if (typeof this.arg != "undefined" && this.arg.length != 0)
		json.arg = this.arg;

    return json;
}