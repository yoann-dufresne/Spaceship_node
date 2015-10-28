module.exports.Log = Log;

var fs = require('fs');
var spec = require('./spec');

/*
 * args: type, id
 */
function Log(sp) {
	this.id = 0;
	this.reset()
	this.leaderBoard = [];
	this.spaceship = sp;
	this.loadLeaderBoard();
}

Log.prototype = {
    reset : function () {
		this.time = 0;
		this.event = [];
		this.oxygen = [];
		this.time_left = [];
	},
	
	update : function (){
		this.time++;
		this.oxygen.push(this.spaceship.oxygen)
		this.time_left.push(this.spaceship.time_left)
	},
	
	loadLeaderBoard : function () {
		var self = this;
		fs.readFile('log/leaderBoard.txt', function(err,data) {
			if (err) {
				self.leaderBoard = [];
				console.log("next_id : " + self.id)
			}else{
				if (data != "" && data != "undefined"){
					self.leaderBoard = JSON.parse(data);
				}else{
					self.leaderBoard = [];
				}
				self.save();
				console.log(self.leaderBoard);
				for (var i in self.leaderBoard)
					if (self.leaderBoard[i].id > self.id) self.id = self.leaderBoard[i].id;
				self.id++;
				console.log("next_id : " + self.id)
			}
		});
		
	},
	
	saveLeaderBoard : function () {
		if (!fs.exists('log/'))
			fs.mkdir('log/', function () {
			fs.writeFile('log/leaderBoard.txt', JSON.stringify(this.leaderBoard, 2) ,function(err,data) {});
		});
	},
	
	save : function () {
		this.spaceship.updateEvents();
		var win = false;
		if (this.spaceship.status=="victory") win = true;
		
		var game = {
			'time' : this.time,
			'win' : win,
			'names' : [this.spaceship.team],
			'id' : this.id
		}
		this.leaderBoard.push(game);
		this.saveLeaderBoard();
		
		var game2 = {
			'time' : this.time,
			'win' : win,
			'names' : [this.spaceship.team],
			'id' : this.id,
			'time_left' : this.time_left,
			'oxygen' : this.oxygen
		}
		game2.event = [];
		for (var i in this.event) game2.event[i] = this.event[i].toJson();	
		
		game2.room = this.spaceship.room;

		console.log("save file : log/game_"+this.id+".txt")
		fs.writeFile('log/game_'+this.id+'.txt', JSON.stringify(game2) ,function(err,data) {});
		
		this.id++;
		console.log("next_id : " + this.id)
	},
	
    toJson : function () {
		var json_event = [];
        for (var i in this.event) json_event.push(this.event[i].toJson());
		
		return json_event;
    }
    
}