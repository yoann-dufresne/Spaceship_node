module.exports.Spaceship = Spaceship;

var r = require('./room'),
    p = require('./player');

function Spaceship() {
    console.log( "--------new spaceship---------" );
    this.init();
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
        console.log( "> reset spaceship" );
        this.oxygen = 100;
        this.time_left = this.initialTimeLeft;
        this.status = 'stoped';
        this.event = [];
        this.delta_oxygen = 0;
        this.current_speed = 0;
    },
    
    init : function () {
        console.log( "> init spaceship" );
        this.reset();
        this.room = [];
        this.player = [];
    },
    
    addRoom : function (type) {
        var room = new r.Room(type);
        this.room.push(room);
    }, 
    
    addPlayer : function (type) {
        var player = new p.Player(type);
        this.player.push(player);
    }, 
    
    addEvent : function (event) {
        event.applyEffect(this);
        this.event.push(event);
    }, 
    
    update : function () {
        
        if (this.status == 'active'){
            this.delta_oxygen = 0;
            this.current_speed = 0;
            this.effect = [];
            
            //compute the sum of all bonus/malus oxygen/speed given by rooms and events
            for (var i = 0; i < this.room.length; i += 1) {
                this.delta_oxygen += this.room[i].oxygen;
                this.current_speed += this.room[i].speed;
                // previously 'this.effect += ...', but
                //   addition on arrays produces a string, not an array
                this.effect = this.effect.concat(this.room[i].effect);
            }
            
            for (var i = 0; i < this.event.length; i += 1) {
                // filter the solved events
                if (this.event[i].active){ 
                    this.delta_oxygen += this.event[i].oxygen;
                    this.current_speed += this.event[i].speed;
                    this.effect = this.effect.concat(this.event[i].effect);
                }
            }
            
            //update ship current oxygen/time_left
            this.oxygen = (this.oxygen + this.delta_oxygen) % 100;
            this.time_left -= this.current_speed;
            
            //remove solved event from event list
            for (var i = this.event.length-1 ; i>=0; i -= 1) {
                if (!this.event[i].active) this.event.splice(i, 1);
            }     
            
            // the order is important and might be discuted
            if (this.oxygen < 0){
                this.status = 'gameOver';
            }
            else if (this.time_left < 0){
                this.status = 'victory';
            }
        }
    },

    // stop the interval that calls update()
    stop : function () {
        if (this.updateIntervalID !== undefined){
            clearInterval(this.updateIntervalID);
        }
        this.status = 'stoped';
        return 'game paused';
    },
    
    // start the interval that calls update()
    start : function () {
        var that = this;
        this.status = 'active';
        this.updateIntervalID = setInterval(
            function () { that.update() }, this.updateIntervalDelay
        );
        return 'game start';
    },
    
    toJson : function () {
        var json_room = [];
        for (var i in this.room) json_room.push(this.room[i].toJson())
        
        var json_player = [];
        for (var i in this.player) json_player.push(this.player[i].toJson())
            
        var json_event = [];
        for (var i in this.event) json_event.push(this.event[i].toJson())
        
        var json = {
            'status' : this.status,
            'oxygen' : this.oxygen,
            'time_left' : this.time_left,
            'current_speed' : this.current_speed,
            'delta_oxygen' : this.delta_oxygen,
            'room' : json_room,
            'player' : json_player,
            'event' : json_event
        };
        return json;
    }
}
