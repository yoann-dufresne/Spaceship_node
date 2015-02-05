module.exports.Player = Player

function Player(type) {
    console.log("-------new_player : "+type+"------")
    this.type = type
}

Player.prototype = {
    
    toJson : function () {
        var json = {
            'type' : this.type
        }
        return json
    }
    
}