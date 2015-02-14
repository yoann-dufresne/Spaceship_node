const NB_ALIEN_PER_EVENT = 5;
const totalTime = 10;
const NAMES = ["Roger", "Paul", "Plitrik", "Jurmidov", "Mazuk", "Timoléon", "Pritonk", "Zglorg", "$#@&!ù%", "Jaipadnom", "Bulgroz", "Zorglub", "Althazor", "RémiBocquet", "Pritwook", "Khandivlop", "Basshunter", '"); -- ', "Rhibox", "TotoLeHaricot", "Razhul", "Ruffux", "Grosmehz", "Sanchez", "Ramirez", "Thuiong", "Popopoy", "Yopopop"];

var alienId = 0;

/* Creation of an alien mini game
* If there is no alien json passed in parameter, then a list of new alien is created.
*/
function AlienGame (frame, json) {
	this.frame = frame;

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
		this.createDivs();
		this.listen();
	},

	createDivs : function () {
		this.blocs = {};
		var decal = 0;
		var self = this;

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

			self.blocs[alien.id] = alienBlock;

			setTimeout(
				function () {
					// Add the animation property
					self.frame.appendChild(alienBlock);
					alienBlock.classList.add("animated");
					self.setTime(alien, alienBlock);
				},
				decal++*1000
			);
		});
	},

	setTime : function (alien, bloc) {
		var self = this;
		window.setTimeout(function () {
			$(bloc).remove();
		}, self.time*997);
	},

	listen : function () {
		this.namesLength = 0;
		for (var i=0 ; i<this.aliens.length ; i++) {
			if (this.aliens[i].name.length > this.namesLength)
				this.namesLength = this.aliens[i].name.length;
		}

		this.keyFunction = document.onkeypress;
		this.keys = new Array();

		var self = this;
		document.onkeypress = function (event) {
			var c = String.fromCharCode(event.which);
			self.keys.push(c);

			if (self.keys.length > 10)
				self.keys.shift();
			
			// Creation of the name
			var txt = "";
			for (var i=0 ; i<self.keys.length ; i++)
				txt += self.keys[i];
			console.log ("Toto : " + txt);

			// Name test for each alien
			self.aliens.forEach( function (alien) {
				if (alien.name.length <= txt.length) {
					var name = txt.substring(txt.length-alien.name.length, txt.length);
					if (name == alien.name) {
						self.killAlien(alien);
					}
				}
			});
			console.log(txt);
		};

	},

	killAlien : function (alien) {
		this.aliens.splice(this.aliens.indexOf(alien), 1);

		$(this.blocs[alien.id]).remove();
	}
	
}

function Alien (name) {
	this.id = alienId++;
	this.name = name;
	this.img = "alien.png";
}



var frame = document.getElementById("frame");
var ag = new AlienGame(frame);
ag.init();
