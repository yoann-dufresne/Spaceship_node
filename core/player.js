module.exports.Player = Player;

/*
 * args: type, id
 */
function Player(args) {
    console.log("-------new_player : "+args.type+"------");
    this.type = args.type;
    this.id = args.id;
}

Player.prototype = {
    
    toJson : function () {
        var json = {
            'type' : this.type,
            'id' : this.id
        };
        return json;
    }
    
}