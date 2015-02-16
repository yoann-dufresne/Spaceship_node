const NB_ALIEN_PER_EVENT = 10;
const totalTime = 15;
const maxImg = 20;
const maxMoves = 5;
const NAMES = ["Roger", "Paul", "Plitrik", "Jurmidov", "Mazuk", "Timoléon", "Pritonk", "Zglorg", "$#@&!ù%", "Jaipadnom", "Bulgroz", "Zorglub", "Althazor", "RémiBocquet", "Pritwook", "Khandivlop", "Basshunter", '"); -- ', "Rhibox", "TotoLeHaricot", "Razhul", "Ruffux", "Grosmehz", "Sanchez", "Ramirez", "Thuiong", "Popopoy", "Yopopop","Mantarik","Rakatakata","FlortZ","Yarkixu","Xiwouku","MohamedAlien","kytria","Traomister","Gnorkol","DzaLaKrte","jeVpRdre","Mouahaha","Gorukudrik","Krofniam","rRrRrRr","Thymnokur","Ertko","Gtaloy","Zafalisto","Rfarokàé","Typhirinux",")-O-(","123465789","Ztheurx"];

var alienId = 0;

/* Creation of an alien mini game
* If there is no alien json passed in parameter, then a list of new alien is created.
*/
function AlienGame (frameId, callback, json) {
	this.frame = document.getElementById(frameId);
	this.frame.classList.add("alienFrame");
	this.callback = callback;
	this.ended = false;

	// Create alien objects
	if (json == undefined) {
		this.aliens = [];
		for (var i=0 ; i<NB_ALIEN_PER_EVENT ; i++) {
			var alienName = NAMES[Math.floor(Math.random()*(NAMES.length-1))];
			this.aliens.push(new Alien(alienName));
		}
	} else {
		this.aliens = eval (json);
	}

	this.time = totalTime;
	this.init();
}

AlienGame.prototype = {

	init : function () {
		// Doors on the top
		var doors = document.createElement("img");
		doors.src = "js/miniGames/alien/salle_alien_up.png";
		doors.id = "doors";
		this.frame.appendChild(doors);
		
		// Add user text	
		this.p = document.createElement("p");
		this.p.id = "alienText";
		this.frame.appendChild(this.p);

		this.createDivs();
		this.listen();
	},

	createDivs : function () {
		this.blocs = {};
		var decal = 0;
		var that = this;

		// Create a display for each alien.
		this.aliens.forEach(function (alien) {
			// A bloc containing all display for the alien
			var alienBlock = document.createElement("div");
			alienBlock.classList.add("alien");
			// Offset is to calculate the gap between the bottom of the door and the alien position
			var layer = Math.floor(Math.random()*100);

			// Add the name of the alien
			var txt = document.createElement("p");
			txt.innerHTML = alien.name;
			alienBlock.appendChild(txt);

			// Add the correct img for the alien
			var img = document.createElement("img");
			img.classList.add("alienImg");
			img.src = alien.img;
			alienBlock.appendChild(img);

			that.blocs[alien.id] = alienBlock;

			window.setTimeout(
				function () {
					// Add the animation property
					that.frame.appendChild(alienBlock);
					that.addAnimation(alienBlock);
					that.setTime(alien, alienBlock);
				},
				decal++*2000
			);
		});
	},

	addAnimation : function (bloc) {
		bloc.style.position = "absolute";
		
		// Webkit
		bloc.style["-webkit-animation-timing-function"] = "linear";
		bloc.style["-webkit-animation-duration"] = "" + totalTime + "s";
		bloc.style["-webkit-animation-iteration-count"] = "1";
		bloc.style["-webkit-animation-name"] = "alienBox" + Math.ceil(Math.random()*maxMoves);

		// Mozilla
		bloc.style["-moz-animation-timing-function"] = "linear";
		bloc.style["-moz-animation-duration"] = "" + totalTime + "s";
		bloc.style["-moz-animation-iteration-count"] = "1";
		bloc.style["-moz-animation-name"] = "alienBox" + Math.ceil(Math.random()*maxMoves);

		// Classic animation
		bloc.style["animation-timing-function"] = "linear";
		bloc.style["animation-duration"] = "" + totalTime + "s";
		bloc.style["animation-iteration-count"] = "1";
		bloc.style["animation-name"] = "alienBox" + Math.ceil(Math.random()*maxMoves);
	},

	setTime : function (alien, bloc) {
		var that = this;
		window.setTimeout(function () {
			$(bloc).remove();
			delete that.blocs[alien.id];

			console.log(Object.keys(that.blocs).length);
			if (Object.keys(that.blocs).length == 0 && that.aliens.length > 0)
				that.callCallback();
		}, that.time*997);
	},

	listen : function () {
		this.namesLength = 0;
		for (var i=0 ; i<this.aliens.length ; i++) {
			if (this.aliens[i].name.length > this.namesLength)
				this.namesLength = this.aliens[i].name.length;
		}

		this.keyFunction = document.onkeydown;
		this.keys = new Array();

		var that = this;
		document.onkeydown = function (event) {
			event = event || window.event;
			
			if (event.keyCode == 8 || event.keyCode == 46) {
				event.returnValue = false;
			}
		}
		document.onkeypress = function (event) {
			event = event || window.event;
			
			var c = String.fromCharCode(event.which);
			that.keys.push(c);

			if (that.keys.length > that.namesLength)
				that.keys.shift();
			
			// Creation of the name
			var txt = "";
			for (var i=0 ; i<that.keys.length ; i++)
				txt += that.keys[i];
			that.p.innerHTML = txt;

			// Name test for each alien
			that.aliens.forEach( function (alien) {
				if (alien.name.length <= txt.length) {
					var name = txt.substring(txt.length-alien.name.length, txt.length);
					if (name == alien.name) {
						that.killAlien(alien);
					}
				}
			});
		};

	},

	killAlien : function (alien) {
		this.aliens.splice(this.aliens.indexOf(alien), 1);
		$(this.blocs[alien.id]).remove();
		delete this.blocs[alien.id];

		if (Object.keys(this.blocs).length == 0 || this.aliens.length == 0)
			this.callCallback();
	},

	callCallback : function () {
		if (!this.ended) {
			this.ended = true;
			this.frame.innerHTML = "";
			this.frame.classList.remove("alienFrame");
			document.onkeypress = this.keyFunction;
			this.callback(JSON.stringify(this.aliens));
		}
	}
	
}

function Alien (name) {
	this.id = alienId++;
	this.name = name;

	var idx = Math.ceil(Math.random()*maxImg);
	this.img = "js/miniGames/alien/images/alien" + idx + ".png";
}


//var json = '[{"id":1,"name":"RémiBocquet","img":"images/alien14.png"},{"id":2,"name":"Jurmidov","img":"images/alien3.png"},{"id":3,"name":"Typhirinux","img":"images/alien19.png"},{"id":4,"name":"Rakatakata","img":"images/alien13.png"},{"id":6,"name":"MohamedAlien","img":"images/alien5.png"},{"id":7,"name":"Thymnokur","img":"images/alien5.png"}]';
//var ag = new AlienGame("frame", function(json) {alert(json)});

