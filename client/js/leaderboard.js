
function leaderboard () {
	this.init();
}

leaderboard.prototype = {
	
	init : function () {
		var self = this;
		this.comunicate = new ServerCommunication();    
		this.comunicate.askServer("/spaceship", 
		{"command":"leaderBoard"}, 
		function (spaceshipData) {
			self.data = JSON.parse(spaceshipData);
			self.build();
		});
		
		document.onkeypress = function (e) { self.checkKey(e);}
	},
	
	build : function () {
		//trie les parties 
		this.data.sort(function (a, b) {
			if (a.win && !b.win) return -1;
			if (!a.win && b.win) return 1;
			if (a.win && (a.time > b.time) ) return 1;
			if (a.win && (a.time < b.time) ) return -1;
			if (!a.win && (a.time > b.time) ) return -1;
			if (!a.win && (a.time < b.time) ) return 1;
			return 0;
		});

		//calcul la durée de chaque game
		for (var i=0; i<this.data.length; i++){
			console.log(i)
			var minute = Math.floor(this.data[i].time/60)
			var sec = Math.floor(this.data[i].time%60)
			if (sec<10) sec = "0"+sec
			this.data[i].time =  minute + ":" + sec 
		}
		
		var div_parent = $("#lb_table");
		
		var correct = 0;
		for (var i=0; i<this.data.length; i++){
			if (this.data[i].names[0] == '') {
				correct += 1;
				continue;
			}

			var team = "?"
			if (typeof this.data[i].names != "undefined"){ 
				team = ""
				for (var j=0; j<this.data[i].names.length; j++){
					team += " " + this.data[i].names[j]
				}
			}
			var status;
			if (this.data[i].win) status = "win"
			else status = "fail"
			
			var div = jQuery('<div/>', {
				html: "<div class='lb_rank'>" + (i-correct) +
				"</div><div class='lb_team'>" + team +
				"</div><div class='lb_status'>" + status +
				"</div><div class='lb_time'>" + this.data[i].time + "</div>",
				class: 'lb_row',
				id : this.data[i].id
			})
			.click(function(){
				document.location.href = "result.html?id="+this.id
			})
			.appendTo(div_parent);
		}
	},
	
	checkKey : function (e) {
		e = e || window.event;
		e.preventDefault()
		
		var key = e.keyCode;
		if (key==0) key = e.which
	
		if (key == 13){
			document.location.href = "CommandCenter.html"
		}
	}
}

var lb = new leaderboard() 