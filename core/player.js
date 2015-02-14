module.exports.Player = Player;

var spec = require('./spec');

/*
 * args: type, id
 */
function Player(args) {
    console.log("-------new_player : "+args.type+"------");
    this.type = args.type;
    this.id = args.id;
	this.password = spec.PLAYER[this.type].password
}

Player.prototype = {
    
    toJson : function () {
        var json = {
            'type' : this.type,
            'id' : this.id,
			'password' : this.password
        };
        return json;
    }
    
}