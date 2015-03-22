
function Result() {

    this.init();
}


Result.prototype = {
	
	init : function () {
		
		var self = this;
		this.id = 0;
		this.comunicate = new ServerCommunication();    
		
		var tab = location.search.replace("?","").split("=")
		for (var i in tab){
			if (tab[i] == "id"){
				this.id = tab[1+parseInt(i)];
			}
		}
		
		this.comunicate.askServer("/spaceship", 
		{
			"command":"result",
			"game_id": this.id
		}, 
		function (spaceshipData) {
			self.data = JSON.parse(spaceshipData);
			self.display();
		});
		//document.onkeypress = function (e) { self.checkKey(e);}
		
	},
    
    display : function() {
        
        console.log(this.result)
        //fail/win
        
        if (!this.data.win) {
            $("#result").html("Game Over")
            $("#result").css("color","rgba(253,0,13,1)")
        }else{
            $("#result").html("Victory")
            $("#result").css("color","rgba(7,165,210,1)")
        }
        
        //game_time
        var ellapsed_time = this.data.time;
        var minute = Math.floor(ellapsed_time/60)
        var sec = Math.floor(ellapsed_time%60)
        if (sec<10) sec = "0"+sec
        $("#score").html( minute + ":" + sec )
        
        var canvas = document.getElementById("canvas");
        var proc = new Processing(canvas, graphProc);
        proc.externals.sketch.options.isTransparent = true;
        /*
        var delta = this.data.time;
        console.log(delta)
        for (var key in this.data.rooms){
            var div = jQuery('<div/>', {
                html: this.result.rooms[key].name,
                class: 'room_stat'
            })
            
            for (key2 in this.data.rooms[key].events){
                var event = this.data.rooms[key].events[key2]
                var start = (((event.start - this.stat.start)/delta).toFixed(3))*100
                var stop = 100
                if (typeof event.stop != "undefined") stop = (((event.stop - this.stat.start)/delta).toFixed(3))*100
                jQuery('<div/>', {
                    style: 'width : '+(stop-start)+"%"+'; left : '+start+"%"+'; background-color : '+event_def[event.name].color,
                    class: 'event_bar'
                })
                .appendTo(div)
            }
            div.appendTo("#stats")
        }
        */
    }
}


function graphProc(p) {
    /* @pjs transparent="true"; */
    
    p.setup = function() {
        p.smooth();
        p.hint(p.DISABLE_OPENGL_2X_SMOOTH);
        p.hint(p.ENABLE_OPENGL_4X_SMOOTH);
        p.frameRate(1)
    }
    
    p.draw = function() {
        p.background(0,0,0,255)
        p.width = document.getElementById("graph").offsetWidth
        p.height = document.getElementById("graph").offsetHeight
        p.size(p.width, p.height);
        
        var delta = result.data.time-1
        
        //oxygen
        p.noStroke()
        p.fill(7,165,210,255)
        p.beginShape();
        p.vertex(0,0);
        var oxygen = result.data.oxygen
        for (var key in oxygen){	
            var x = key/delta;
            var y = oxygen[key]/100;
            p.vertex(x*p.width, (1-y)*p.height)
        }
        p.vertex(p.width,p.height);
        p.vertex(0,p.height);
        p.endShape(p.CLOSE);
        
        
        //travel
        p.stroke(255,69,0,255)
        p.strokeWeight(5)
        p.noFill()
        p.beginShape();
        p.vertex(0,p.height);
        var time_left = result.data.time_left
        for (var key in time_left){
            var x = key/delta;
            var y = (time_left[key]/time_left[0]);
            p.vertex(x*p.width, y*p.height)
        }
        p.endShape();
        
    };
}







var result = new Result()

//result.get_stat()


function checkKey (e) {    
    e = e || window.event;
    e.preventDefault()
    
    var key = e.keyCode;
    if (key==0) key = e.which
 
    if (key == 13){
        document.location.href = "leaderboard.html"
    }
}

document.onkeydown = function (e) { checkKey(e);}
    