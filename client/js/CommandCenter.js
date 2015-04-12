var xc = 0.5
var yc = 0.481
var r1 = 0.48
var r2 = 0.44

/*
 *
 * */
function CommandCenter() {
}


CommandCenter.prototype = {
	
    init : function () {
		var self = this;
		this.comunicate = new ServerCommunication();        
        this.rooms = []
        
        this.ship = document.getElementById("ship");
		this.goal = document.getElementById("goal");
		this.oxygen = document.getElementById("oxygen_level");
		this.comunicate.askServer("/spaceship", {"command":"reset"});
		
        //processing
        proc = new Processing(cc.ship, shipProc);
        proc.externals.sketch.options.isTransparent = true;
        
        //auto-resize
        window.onresize = function () {
            self.resize()
        };
		
		this.getNames();
        this.resize();
        this.update();
		
		//processing
        proc = new Processing(cc.ship, shipProc);
        proc.externals.sketch.options.isTransparent = true;
		
		setInterval(function(){self.update()}, 1000);
	},
	
	update : function () {
		var self = this;
		this.comunicate.askServer("/spaceship", 
			    {"command":"getStatus"}, 
			    function (spaceshipData) {
					self.data = JSON.parse(spaceshipData);
					self.init_rooms();
					self.display();
			    });
	},

    /*build/rebuild interface
     * 
     * */
    init_rooms : function () {
		if (this.data.room.length != 0 & this.data.room.length != this.rooms.length){
			
			//reset
			this.rooms = [];
			$(".room").remove();
			
			console.log("CommandCenter: init interface") 
			var container = document.getElementById("screen")
			
			for (var i in this.data.room) {
				var type = this.data.room[i].type;
				
				//create room box
				var box = document.createElement('div');
				box.className = "room";
				box.style.top
				
				//add room name div
				var name = document.createElement('div');
				name.className = "room_name";
				name.appendChild(document.createTextNode(type));
				box.appendChild(name);
				
				//add room event
				var div_event = document.createElement('div');
				div_event.className = "room_event";
				var eventi = document.createElement('span');
				eventi.className = "event_icon";
				div_event.appendChild(eventi);
				var eventn = document.createElement('span');
				eventn.className = "event_name";
				div_event.appendChild(eventn);
				box.appendChild(div_event);

				//add room box info to HTML
				container.appendChild(box);
				
				//store box dom element for later (just in case)
				this.rooms.push({
					"id" : this.data.room[i].id,
					"box" : box,
					"name" : name,
					"event_icon" : eventi,
					"event_name" : eventn
				});
			}
			this.update_room_pos();
		}
    },
    
    /*
     * 
     * */
    resize : function () {
        console.log("CommandCenter: resize")      
        this.update_room_pos();
        
        this.ship_width = this.ship.offsetWidth
        this.ship_height = this.ship.offsetHeight
    },
    
    
    /*compute room width/height/position 
     * 
     * */
    update_room_pos : function  () {
		if (this.rooms.length != 0){
			var width = document.getElementById("screen").offsetWidth
			var height = document.getElementById("screen").offsetHeight
			
			var margin = 0.03*height
			var room_width = 0.2*width
			var room_height = this.rooms[0].box.offsetHeight
			
			var ellipse_width = width - room_width - margin
			var ellipse_height = 0.85*height - room_height -margin
			
			for (var i in this.rooms) {
				//YEAHHHH math
				var o = (Math.PI*2) * ( (0.5+parseFloat(i))/this.rooms.length ) 
				var x = Math.round( width*xc  + ( Math.sin(o) * (ellipse_width/2) ) ) 
				var y = Math.round( height*yc + ( Math.cos(o) * (ellipse_height/2) ) )
				
				//
				var r = this.rooms[i].box
				r.style.width = room_width + "px";
				r.style.top = y - (room_height/2) + "px";
				r.style.left = x - (room_width/2) + "px";
			}
        }
    },
    
    update_goal : function () {
        if (this.data.current_speed >= 1){
			this.goal.style.color = "rgba(7,165,210,1)";
        }else if (this.data.current_speed !=0 ) {
			this.goal.style.color = "orangered";
		}else{
			this.goal.style.color = "rgba(253,0,13,1)";
        }
        
        var t = Math.floor(this.data.time_left);
        var sec = (t%60);
        if (sec<10) sec = "0"+sec;
            
        this.goal.innerHTML = Math.floor(t/60) + ":" + sec;
    },
    
    update_oxygen : function () {
        if (this.data.delta_oxygen > 0){
            this.oxygen.className = "gauge_level oxygen";
        }else{
            this.oxygen.className = "gauge_level oxygen2";
        };
        
        this.oxygen.style.width = this.data.oxygen + "%";
    },
    
    display : function () {        
        this.update_event();
        this.update_goal();
        this.update_oxygen();      
		this.checkStatus();
    },
    
    /* 
     * 
     * */
    update_event : function() {
		for (var i in this.rooms){
            var r = this.rooms[i]
			r.event_icon.style.background = 'rgba(0,0,0,0)'
			r.event_name.innerHTML = ""
		}    
		
		//TODO reork ... this work only for event with effect on only one room
		for (var i in this.data.event){
			var room_id = this.data.event[i].room_id;
			var type = this.data.event[i].type;
			var r = this.rooms[room_id]
			if (typeof r != 'undefined'){
				r.event_icon.style.background = EVENT[type].color
				r.event_name.innerHTML = type
			}
		}
		
    },
	
	checkStatus : function () {
		if (this.data.status == 'gameOver' || this.data.status == 'victory') { 
			this.end();
		}
	},
    
	getNames : function (){
		var self=this;
		document.getElementById("team").focus();
		document.onkeypress = function (e) {
			e = e || window.event;
			
			var key = e.keyCode;
			if (key==0) key = e.which;
				
			if (key == 13){
				e.preventDefault();
				self.comunicate.askServer("/spaceship", {"command":"registerteam", "name":document.getElementById("team").value});
				document.onkeypress = function () {};
				$("#team_name").css('display','none');
				self.start();
			};
		};
	},
	
    start : function(){
		var self = this;
		document.onkeypress = function (e) {
			e = e || window.event;
			
			var key = e.keyCode;
			if (key==0) key = e.which;
				
			if (key == 13){
				e.preventDefault();
				$("#start").css('display','none');
				self.comunicate.askServer("/spaceship", {"command":"start"});
				document.onkeypress = function () {};
			};
		};
    },
    
    end : function() {
		var self = this;
        setTimeout(function(){
            window.location.href = "result.html?id="+self.data.game_id;
        },2000)
    },
    

}//end CommandCenter prototype







function shipProc(p) {
    /* @pjs transparent="true"; */
    
    p.setup = function() {
        p.smooth();
        p.hint(p.DISABLE_OPENGL_2X_SMOOTH);
        p.hint(p.ENABLE_OPENGL_4X_SMOOTH);
        p.frameRate(25)
    }
    
    p.draw = function() {
		p.background(0,0,0,0)
		if ( (typeof cc.data != 'undefined') && (cc.data.status!="stoped") ){
			
			p.width = cc.ship_width
			p.height = cc.ship_height
			p.size(p.width, p.height);
			
			var i=0
			
			for (var i in cc.data.room) {
				var isBroken = false;
				if (cc.data.room[i].status == 'disabled') isBroken = true;
				
				var start = - (Math.PI*2) * ( (parseFloat(i)+1)/cc.rooms.length ) + Math.PI/2;
				var stop = - (Math.PI*2) * ( (parseFloat(i))/cc.rooms.length ) + Math.PI/2;
				
				p.strokeWeight(2);
				p.stroke(255,255,255,100);
				p.drawSegment(start,stop,isBroken);
				i++;
			}
		}
        
    };
    
    p.drawSegment = function(start,stop,broken) {
        
        var m = (start+stop)/2
        var x = p.width*xc + 10*Math.cos(m) 
        var y = p.height*yc + 10*Math.sin(m)
        
        if (broken){
            p.fill(253,0,13,(80+Math.cos(p.frameCount/5)*60) )
        }else{
            p.fill(7,165,210,80)
        }
        p.arc( x, y, r1*p.width, r2*p.height, start, stop)
        
        p.line(x, y, x+Math.cos(stop)*r1*(p.width/2) , y+Math.sin(stop)*r2*(p.height/2) )
        p.line(x, y, x+Math.cos(start)*r1*(p.width/2) , y+Math.sin(start)*r2*(p.height/2) )
    }

}   




var proc = null
var cc = new CommandCenter()
cc.init();







