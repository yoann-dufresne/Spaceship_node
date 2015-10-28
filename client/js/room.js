const blinkProbability = 0.1;

function release_keyboard(){
    document.onkeydown = function (e) { }
    document.onkeypress = function (e) { }
    document.onkeyup = function (e) { }
}

function Room() {
    this.lock_div = document.getElementById("lock")
    this.input=""
    this.init()
    this.lock();
    this.print();

	this.flag = false;
}


Room.prototype = {

    init : function () {
        var self = this;
		this.comunicate = new ServerCommunication();

        var img = document.createElement("img");
        self.imgPara = img;
        img.src = "img/parasites.jpg";
        img.id = "parasites";
        document.getElementById("mainFrame").appendChild(img);

		setInterval(function(){self.update()}, 1000);
	},

	update : function () {
		var self = this;
		this.comunicate.askServer("/spaceship",
			    {"command":"getStatus"},
			    function (spaceshipData) {
					self.data = JSON.parse(spaceshipData);
					self.display_room_selector();

                    // Blink test
                    if (self.data.room[4].status == "disabled" && Math.random() <= blinkProbability)
                        self.imgPara.style.opacity = 1;
                    else
                        self.imgPara.style.opacity = 0;
			    });
	},

	display_room_selector : function () {
		var self = this;
		if (!this.flag & this.data.room.length > 0) {
			$("#menu").html("");
			for (var i in this.data.room){
				this.div = jQuery('<div/>', {
					html: this.data.room[i].type,
					id : "room_"+this.data.room[i].id,
					click: (function(){self.defineRoom($(this))}),
					class: 'button'
				})
				.appendTo("#menu")
			}
			this.flag = true;
		}
	},

    defineRoom : function(room){
        this.roomID = room.attr('id').replace("room_", "");
        $("#menu").fadeOut(500)

        $("#door_label").html(this.data.room[this.roomID].type)
        $("#room_name").html(this.data.room[this.roomID].type)
    },

	/*
    update : function(){
		var self = this;
		if (typeof spaceship.data.rooms[this.roomID].event != 'undefined'){
			if (this.event_solved.indexOf(spaceship.data.rooms[this.roomID].event.start) != -1){ this.solve() }
		}
    },
    */

    //ouvre la porte
    open : function() {
        var self=this;

        $('#red_left').fadeOut(1000);
        $('#red_right').fadeOut(1000);
        setTimeout(function(){
            $('#door_right').animate({ left: "90%"}, 500);
            $('#door_left').animate({ left: "-35%"}, 500);
            self.checkEvent()
        },800);
    },


    //ferme la porte
    close : function() {
	var self=this;
        $('#red_left').fadeIn(1000);
        $('#red_right').fadeIn(1000);
        setTimeout(function(){
            $('#door_right').animate({ left: "43.5%"}, 500);
            $('#door_left').animate({ left: "0%"}, 500);
        },800);
        this.input=""
	this.print()
        setTimeout(function(){self.lock()},1500);
    },

    //
    checkEvent : function () {
        var self=this;

		var instruction = {
			'Fire' : " Guide la lance à incendie avec les flèches du clavier pour éteindre les feux. Maintenir CTRL pour accélérer. ",
			'Alien' : " Tue les Aliens en tapant leurs noms sans faute. Possibilité d'effacer. ",
			'Hack' : " Trouve le code secret de 3 chiffres : Vert chiffre bien placé. Orange chiffre présent mal placé. Rouge chiffre absent. "
		}

		this.event = -1;

		for (var i in this.data.event){
			if (this.data.event[i].room_id == this.roomID){
				this.event = i;
				this.event_id = this.data.event[i].id;
				this.event_type = this.data.event[i].type;
			}
		}

        //check if event exist
        if (this.event == -1){
            $("#room_event").html("room status : OK")
            setTimeout(function(){
                self.close()
            },1500);

            return
        }

        if (EVENT[this.data.event[this.event].type].player.indexOf(this.data.player[this.player_id].type) == -1) {
			$("#room_event").html( EVENT[this.data.event[this.event].type].player
				+ " needed to solve "
				+ EVENT[this.data.event[this.event].type].type )
			setTimeout(function(){
				self.close()
			},1500);

			return
        }

        var callback = function(arg) { self.solve(arg) }//double closure ?

		$("#room_event").html(instruction[this.event_type]);
        switch(this.event_type) {
			case "Fire":

                var node = document.getElementById('game')
			    fire.start({
                    node: node,
                    callback: callback,
                    canvasWidth: node.clientWidth,
                    canvasHeight: node.clientHeight,
                    mapWidth: Math.floor(node.clientWidth / 50),
                    mapHeight: Math.floor(node.clientHeight / 50),
                    snakeSize: 6,
                    waterStock: 3,
                    scoreToWin: 3,
                    fireSpawnProba: 1,
                    waterSpawnProba: 0,
                    maxWatersNumber: 3,
                    maxFiresNumber: 1,
                    startFiresNumber: 1,
                    startWatersNumber: 0,
                    interval: 140,
                }); 
				break;
			case "Alien":
				this.g = new AlienGame("game", callback, this.data.event[this.event].arg);
				break;
			case "Hack":
				hack.start({
					node: document.getElementById('game'),
					callback: callback
				});
				break;
			default:
				this.g = new MiniGames("game", callback);
				break;
		}

    },

    solve :function (arg) {
        $("#room_event").html("YEAHHHHH!!!")
        $("#game").html("")
		var args = {
			'player_id' : this.player_id,
			'event_id' : this.event_id,
			'command': 'solve'
		}

		if (typeof arg != 'undefined'){
			args["arg"]=arg;
		}

		this.comunicate.askServer('/event', args);
        this.close()

    },

    //rend le controle au verrou
    lock : function() {
        var self=this
        //take control of input
        document.onkeydown = function (e) { self.checkKey(e);}
    },

    //input event handler
    checkKey : function(e) {
        e = e || window.event;
        e.preventDefault()

        if (e.keyCode == 8){
            this.input = this.input.substring(0, this.input.length-1)
        }else if (e.keyCode == 13){
            release_keyboard()
            this.unlock();
            return
        }else{
            var char = String.fromCharCode(e.keyCode)
            this.input += char
        }
        this.print()
    },

    //ecran du verrou
    print : function (text){
        this.lock_div.innerHTML = this.input + "<span class='bar'>_</span>"
    },

    //tentative d'ouverture
    unlock : function () {
        var self = this;
        this.input = this.input.toUpperCase();

		this.player_id = -1;

		for (var i in this.data.player){
			if (this.data.player[i].password.toUpperCase() == this.input)  this.player_id = i;
		}

        if (this.player_id != -1){
            this.player = this.data.player[i].type;
            this.print()
            release_keyboard()
            this.open()
        }else{
            this.lock_div.innerHTML = "wrong password"
            setTimeout(function(){
                self.input = ""
                self.print();
                self.lock();
            },800);
        }

        this.input = ""
    }

}





/* s'occupe de lancer les minigames a la suite
 * id => la fenetre dans laquelle les jeux s'affiche
 * n  => le nombre de jeux a résoudre
 */
function MiniGames (id, callback) {
	this.n=3;
	this.id=id;
    this.callback = callback;
	this.gameList = [Game1,Game2,Game3]

	this.nextGame();
}

MiniGames.prototype = {

	nextGame : function () {
		var self = this;
		this.n--;

		//custom callback for the last game
		var callback = function() { self.nextGame() }
		if (this.n <= 0) callback = function() { self.end() }

		//choose random minigame
		var g = this.gameList[ Math.floor(Math.random()*this.gameList.length) ]
		this.m = new g(this.id, callback)
	},

	end : function () {
        this.callback()
	}
}





//TODO factorize
function Game1 (id, callback) {
	this.id = id;
	this.callback = callback;
    this.init();
}

Game1.prototype = {

    init : function () {
        var self = this;	//javascript magic
        this.goal = 20;		//nombre de hit a effectuer
		this.count = 0;
		this.up = true;		//check si la touche n'est pas en hold
        this.key = 97 + Math.floor(Math.random()*26) //choose random letter

        console.log("press " + this.key + "  " + String.fromCharCode(this.key))
		this.display();

		//take control of input
        document.onkeypress = function (e) { self.checkKey(e);}
		document.onkeyup = function () { self.up = true }
    },

	display : function () {
		this.div = jQuery('<div/>', {
			html: "hit <span class='key blink1'>" + String.fromCharCode(this.key) + "</span>  ",
			style: 'display : none',
			class: 'minigame'
		})
		.appendTo("#"+this.id)
		.slideDown(200);

		this.gauge = jQuery('<div/>', {class: 'gauge'})
		.appendTo(this.div)

		this.level = jQuery('<div/>', {class: 'gauge_level'})
		.appendTo(this.gauge)

	},

    checkKey : function(e) {
        e = e || window.event;
        e.preventDefault()

	var key = e.keyCode
	if (key == 0) key = e.which
        if(this.key == String.fromCharCode(key.toString()).toLowerCase().charCodeAt(0).toString()  & this.up){
            this.count++;
			this.level.css("width", "" + Math.floor( (this.count/this.goal)*100 ) + "%");
			this.up = false;
        }
		if (this.count>=this.goal) this.end()
    },

	end : function () {
		release_keyboard()
		this.div.addClass("inactive")
		this.callback()
	}

}



function Game2 (id, callback) {
	this.id =id;
	this.callback = callback;
    this.init();
}

Game2.prototype = {

    init : function () {
        var self = this;	//javascript magic
        this.goal = 60;	//nombre de hit a effectuer
		this.count = 0;
        this.key = 97 + Math.floor(Math.random()*26) //choose random letter

        console.log("hold " + this.key + "  " + String.fromCharCode(this.key))
		this.display();

		//take control of input
        document.onkeypress = function (e) { self.checkKey(e);}
    },

	display : function () {
		this.div = jQuery('<div/>', {
			html: "hold <span class='key'>" + String.fromCharCode(this.key) + "</span>  ",
			style: 'display : none',
			class: 'minigame'
		})
		.appendTo("#"+this.id)
		.slideDown(200);

		this.gauge = jQuery('<div/>', {class: 'gauge'})
		.appendTo(this.div)

		this.level = jQuery('<div/>', {class: 'gauge_level'})
		.appendTo(this.gauge)
	},

    checkKey : function(e) {
        e = e || window.event;
        e.preventDefault()

	var key = e.keyCode;
	if (key==0) key= e.which;

        if(this.key == String.fromCharCode(key.toString()).toLowerCase().charCodeAt(0).toString() ){
            this.count++;
			this.level.css("width", "" + Math.floor( (this.count/this.goal)*100 ) + "%");
        }
		if (this.count>=this.goal) this.end()
    },

	end : function () {
		release_keyboard()
		this.div.addClass("inactive")
		this.callback()
	}

}

function Game3 (id, callback) {
    this.id =id;
    this.callback = callback;
    this.init();
}

Game3.prototype = {

    init : function () {
        var self = this;    //javascript magic
        this.goal = 20; //nombre de hit a effectuer
        this.count = 0;
        this.key1 = 97 + Math.floor(Math.random()*26) //choose random letter
        this.key2 = 97 + Math.floor(Math.random()*26) //choose random letter
	while (this.key1 == this.key2) this.key2 = 97 + Math.floor(Math.random()*26)
        this.previousKey = 0;

        this.display();

        //take control of input
        document.onkeypress = function (e) { self.checkKey(e);}
    },

    display : function () {
        this.div = jQuery('<div/>', {
            html: "altern keys <span class='key'>" + String.fromCharCode(this.key1) + "</span>  and <span class='key'>" + String.fromCharCode(this.key2) + "</span> ",
            style: 'display : none',
            class: 'minigame'
        })
        .appendTo("#"+this.id)
        .slideDown(200);

        this.gauge = jQuery('<div/>', {class: 'gauge'})
        .appendTo(this.div)

        this.level = jQuery('<div/>', {class: 'gauge_level'})
        .appendTo(this.gauge)
    },

    checkKey : function(e) {
        e = e || window.event;
        e.preventDefault()

	var key = e.keyCode;
	if (key==0) key = e.which
        var k = String.fromCharCode(key.toString()).toLowerCase().charCodeAt(0).toString()
        if ( ( this.key1 == k || this.key2 == k ) && k != this.previousKey) {
            this.previousKey = key.toString()
            this.count++;
            this.level.css("width", "" + Math.floor( (this.count/this.goal)*100 ) + "%");
        }
        if (this.count>=this.goal) this.end()
    },

    end : function () {
	release_keyboard()
        this.div.addClass("inactive")
        this.callback()
    }

}

var room = new Room();
