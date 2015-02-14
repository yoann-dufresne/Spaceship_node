
function Admin () {
    this.init();
    this.roomList = {};
    this.eventList = {};

    this.elements = {
        startStopButton: document.getElementById('start-stop'),
        resetButton: document.getElementById('reset'),
        oxygen: document.getElementById('oxygen'),
        deltaOxygen: document.getElementById('delta_oxygen'),
        currentSpeed: document.getElementById('current_speed'),
        timeLeft: document.getElementById('time_left')
    };
}

Admin.prototype.init = function () {
    var self = this;
    this.comunicate = new ServerCommunication();
	document.getElementById("start-stop").onclick = function () {
		self.startStopButtonHandler();
	};

	document.getElementById("reset").onclick = function () {
        self.resetButtonHandler();
	};
	
	setInterval(function(){self.update()}, 1000);

}

Admin.prototype.update = function () {
  var self = this;
  this.comunicate.askServer("/spaceship", 
			    {"command":"getStatus"}, 
			    function (spaceshipData) {
				self.data = JSON.parse(spaceshipData);
				self.display();
			    });
}

Admin.prototype.display = function (spaceshipData) {
  this.displayRooms();
  this.displayEvents();
  this.displayStatus();
}

Admin.prototype.displayRooms = function () {
  for (var i in this.data.room){
    var id = this.data.room[i].id;
    
    if (typeof(this.roomList[id]) == 'undefined'){
      this.addRoom(this.data.room[i]);
    }else{
      this.updateRoom(this.data.room[i]);
    }
  }
}

Admin.prototype.updateRoom = function (data) {
  var room_div = this.roomList[data.id].div;
  if (data.status != "enabled"){
    room_div.style.background = "#DA7870";
  }else{
    room_div.style.background = "#56A764";
  }
}

Admin.prototype.displayEvents = function () {
  var list_id = [];
  
  for (var i in this.data.event){
    var id = this.data.event[i].id;
    list_id.push(id+"");
    
    if (typeof(this.eventList[id]) == 'undefined'){
      this.addEvent(this.data.event[i]);
    }else{
      //this.updateEvent(this.data.event[i]);
    }
  }
  
  for (var i in this.eventList){
    if (list_id.indexOf(i+"") == -1){
      console.log(list_id +" "+ i);
      this.removeEvent(i);
    }
  }
  
}

Admin.prototype.displayStatus = function () {

    if (typeof this.data !== 'undefined'){
        console.log(this.data.status);
        this.elements.startStopButton.text = 'toto';
    }

    this.elements.deltaOxygen.textContent = this.data.delta_oxygen; 
    this.elements.oxygen.textContent = this.data.oxygen; 
    this.elements.timeLeft.textContent = this.data.time_left; 
    this.elements.currentSpeed.textContent = this.data.current_speed; 
}

Admin.prototype.addRoom = function (data) {
    var rooms = document.getElementById("rooms");
  
    var room = document.createElement('div');
    room.className = "room";
    room.id = "room_"+data.id;
    
    var name = document.createElement('h2');
    name.appendChild(document.createTextNode(data.type));

    room.appendChild(name);
    rooms.appendChild(room);
    
    this.roomList[data.id] = { 
      'div' : room,
      'name' : name
    }
}

Admin.prototype.addEvent = function (data) {
	var self = this;
    var events = document.getElementById("events");
  
    var event = document.createElement('div');
    event.className = "event";
    event.id = "event_"+data.id;
    
    var name = document.createElement('h2');
    name.appendChild(document.createTextNode(data.type));

    var args = {
      'player_id' :'admin',
      'event_id' : data.id,
      'command': 'solve'
    }
    var solve = document.createElement('button');
    solve.onclick = function () {
      self.comunicate.askServer('/event', args);
    }
    solve.appendChild(document.createTextNode('solve'));
    
    event.appendChild(name);
    event.appendChild(solve);
    events.appendChild(event);
    
    this.eventList[data.id] = { 
      'div' : event,
      'name' : name
    }
}

Admin.prototype.removeEvent = function (id) {
  var element = this.eventList[id].div;
  element.parentNode.removeChild(element);
  
  delete this.eventList[id];
  
}

Admin.prototype.startStopButtonHandler = function () {
    if (typeof this.data === 'undefined')  {
        return ;
    }

    if (this.data.status === 'active') {
        this.comunicate.askServer("/spaceship", {"command":"stop"});
        this.elements.startStopButton.textContent = 'start';
    }
    else {
        this.comunicate.askServer("/spaceship", {"command":"start"});
        this.elements.startStopButton.textContent = 'stop';
    }
}

Admin.prototype.resetButtonHandler = function (){
    this.comunicate.askServer("/spaceship", {"command":"reset"});
    this.elements.startStopButton.textContent = 'start';
}

var admin = new Admin();

