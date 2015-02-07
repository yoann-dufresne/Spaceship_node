module.exports.Player = Player;

function Player(type, id) {
    console.log("-------new_player : "+type+"------");
    this.type = type;
    this.id = id;
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