var spec = require('./spec');

module.exports.Spaceship = Spaceship;

var r = require('./room'),
    p = require('./player'),
    e = require('./event'),
    eg = require('./eventGenerator'),
	l = require('./log');

function Spaceship() {
    console.log( "--------new spaceship---------" );
    this.init();
    this.nextEventId=0;
}

Spaceship.prototype = {

    // time left when spaceship is initialized, in seconds
    initialTimeLeft : 240, 
    // default delay between each update() calls
    updateIntervalDelay : 1000,
    // Identify the interval in order to stop it when stop() is called
    updateIntervalID : undefined,

    //remet le vaisseau a neuf mais ne modifie pas les salles/joueurs
    reset : function () {
		this.stop();
        console.log( "> reset spaceship" );
		this.log.reset();
        this.oxygen = 100;
        this.time_left = this.initialTimeLeft;
        this.status = 'stoped';
        this.event = [];
        this.delta_oxygen = 0;
        this.current_speed = 0;
		this.team="";
    },
    
    init : function () {
        console.log( "> init spaceship" );
        this.eventGenerator = new eg.EventGenerator(this);
		this.log = new l.Log(this);
        this.reset();
        this.room = [];
        this.player = [];
    },
    
    addRoom : function (type) {
        var id = this.room.length;
        var room = new r.Room({ type: type, id: id });
        
        this.room.push(room);
    }, 
    
    addPlayer : function (type) {
        var id = this.player.length;
        var player = new p.Player({ type: type, id: id });
        
        this.player.push(player);
    }, 
    
    addEvent : function (type, arg) {
        var id = this.nextEventId;
        this.nextEventId++;
        var event = new spec.EVENT[type].constructor({type: type, id: id, spaceship: this, arg : arg});

        this.event.push(event);
    }, 
    
    update : function () {
        
        if (this.status == 'active'){
            this.delta_oxygen = 0;
            this.current_speed = 0;
            this.effect = [];
			
			this.updateEvents();
			this.updateRooms();
			this.eventGenerator.update();
			
            //compute the sum of all bonus/malus oxygen/speed given by rooms ...
            for (var i = 0; i < this.room.length; i += 1) {
                this.delta_oxygen += this.room[i].oxygen;
                this.current_speed += this.room[i].speed;
                // previously 'this.effect += ...', but
                //   addition on arrays produces a string, not an array
                this.effect = this.effect.concat(this.room[i].effect);
            }
            
            //... and events
            for (var i = 0; i < this.event.length; i += 1) {
				this.delta_oxygen += this.event[i].oxygen;
				this.current_speed += this.event[i].speed;
				this.effect = this.effect.concat(this.event[i].effect);
            }
            
            
            //update ship current oxygen/time_left
            this.oxygen = this.oxygen + this.delta_oxygen;
			if (this.oxygen > 100) this.oxygen = 100;
            this.time_left -= this.current_speed;  
            
			this.log.update();
			
            // the order is important and might be discuted
            if (this.oxygen < 0){
				this.stopTime = new Date().getTime();
                this.status = 'gameOver';
				this.log.save()
            }
            else if (this.time_left < 0){
				this.stopTime = new Date().getTime();
                this.status = 'victory';
				this.log.save()
            }
        }
    },
    
    updateEvents : function () {
		//remove solved event from event list
		for (var i = this.event.length-1 ; i>=0; i -= 1) {
			
			if (!this.event[i].active) {
				this.log.event.push(this.event[i]);
				this.event.splice(i, 1);
			}
		}   
    },
	
	updateRooms : function () {
		//reset rooms
		for (var i = 0; i < this.room.length; i += 1) this.room[i].changeStatus(spec.DEFAULT_STATUS);
		
		//apply events effects on rooms
		for (var i = 0; i < this.event.length; i += 1) this.event[i].applyEffect();
	},

    // stop the interval that calls update()
    stop : function () {
	console.log( "> stop spaceship" );
        if (this.updateIntervalID !== undefined){
            clearInterval(this.updateIntervalID);
        }
        this.status = 'stoped';
        return 'game paused';
    },
    
    // start the interval that calls update()
    start : function () {
		console.log( "> start spaceship" );
		this.game_id = this.log.id;
        var that = this;
        this.status = 'active';
		this.startTime = new Date().getTime();
        this.updateIntervalID = setInterval(
            function () { that.update() }, this.updateIntervalDelay
        );
        return 'game start';
    },
    
    getRoomById : function (room_id) {
        return this.room[room_id];
    },
    
    getPlayerById : function (player_id) {
        return this.player[player_id];
    },
    
    getEventById : function (event_id) {
        for (var i in this.event){
            if (this.event[i].id == event_id) return this.event[i];
        };
    },
    
    getAvailableRoom : function () {
        var availableRoom = [];
        for (var i in this.room){
            if (this.room[i].available) availableRoom.push(this.room[i].id);
        };
        return availableRoom;
    },
    
    toJson : function () {
        var json_room = [];
        for (var i in this.room) json_room.push(this.room[i].toJson());
        
        var json_player = [];
        for (var i in this.player) json_player.push(this.player[i].toJson());
            
        var json_event = [];
        for (var i in this.event) json_event.push(this.event[i].toJson());
        
        var json = {
			'game_id': this.game_id,
            'status' : this.status,
            'oxygen' : this.oxygen,
            'time_left' : this.time_left,
            'current_speed' : this.current_speed,
            'delta_oxygen' : this.delta_oxygen,
            'room' : json_room,
            'player' : json_player,
            'event' : json_event,
            'eventGenerator' : this.eventGenerator.toJson(),
			'log' : this.log.toJson()
        };
        return json;
    }
}
