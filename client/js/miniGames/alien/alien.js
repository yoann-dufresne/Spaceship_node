const NB_ALIEN_PER_EVENT = 1;
const totalTime = 10;
const NAMES = ["Roger", "Paul", "Plitrik", "Jurmidov", "Mazuk", "Timoléon", "Pritonk", "Zglorg", "$#@&!ù%", "Jaipadnom", "Bulgroz", "Zorglub", "Althazor", "RémiBocquet", "Pritwook", "Khandivlop", "Basshunter", '"); -- ', "Rhibox", "TotoLeHaricot", "Razhul", "Ruffux", "Grosmehz", "Sanchez", "Ramirez", "Thuiong", "Popopoy", "Yopopop","Mantarik","Rakatakata","FlortZ","Yarkixu","Xiwouku","MohamedAlien","kytria","Traomister","Gnorkol","DzaLaKrte","jeVpRdre","Mouahaha","Gorukudrik","Krofniam","rRrRrRr","Thymnokur","Ertko","Gtaloy","Zafalisto","Rfarokàé","Typhirinux",")-O-(","123465789","Ztheurx"];

var alienId = 0;

/* Creation of an alien mini game
* If there is no alien json passed in parameter, then a list of new alien is created.
*/
function AlienGame (frameId, callback, json) {
	this.frame = document.getElementById(frameId);
	this.callback = callback;

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
}

AlienGame.prototype = {

	init : function () {
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
			var offset = layer/10;
			alienBlock.style.top = "" + (30 + offset) + "%";

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

			setTimeout(
				function () {
					// Add the animation property
					that.frame.appendChild(alienBlock);
					alienBlock.classList.add("animated");
					that.setTime(alien, alienBlock);
				},
				decal++*1000
			);
		});
	},

	setTime : function (alien, bloc) {
		var that = this;
		window.setTimeout(function () {
			$(bloc).remove();
			delete that.blocs[alien.id];
			if (Object.keys(that.blocs).length == 0)
				that.callback(JSON.stringify(that.aliens));
		}, that.time*997);
	},

	listen : function () {
		this.namesLength = 0;
		for (var i=0 ; i<this.aliens.length ; i++) {
			if (this.aliens[i].name.length > this.namesLength)
				this.namesLength = this.aliens[i].name.length;
		}

		this.keyFunction = document.onkeypress;
		this.keys = new Array();

		var that = this;
		document.onkeypress = function (event) {
			var c = String.fromCharCode(event.which);
			that.keys.push(c);

			if (that.keys.length > 10)
				that.keys.shift();
			
			// Creation of the name
			var txt = "";
			for (var i=0 ; i<that.keys.length ; i++)
				txt += that.keys[i];
			console.log ("Toto : " + txt);
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
			console.log(txt);
		};

	},

	killAlien : function (alien) {
		this.aliens.splice(this.aliens.indexOf(alien), 1);
		$(this.blocs[alien.id]).remove();

		if (this.aliens.length == 0)
			this.callback(JSON.stringify(this.aliens));
	}
	
}

function Alien (name) {
	this.id = alienId++;
	this.name = name;

	var idx = Math.ceil(Math.random()*20);
	this.img = "images/alien" + idx + ".png";
}


var ag = new AlienGame("frame", function(json) {alert(json)});
ag.init();
