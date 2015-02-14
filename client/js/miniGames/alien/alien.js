const NB_ALIEN_PER_EVENT = 5;
const NAMES = ["Roger", "Paul", "Plitrik", "Jurmidov", "Mazuk", "Timoléon", "Pritonk", "Zglorg", "$#@&!ù%", "Jaipadnom", "Bulgroz", "Zorglub", "Althazor", "RémiBocquet", "Pritwook", "Khandivlop", "Basshunter", '"); -- ', "Rhibox", "TotoLeHaricot", "Razhul", "Ruffux", "Grosmehz", "Sanchez", "Ramirez", "Thuiong", "Popopoy", "Yopopop","ManTariK","C4-H2W5","RakaTakaTa","FlörtZ","YarKiXu","XiwouNuku","MohamedAlien","kytria","Traomister","Gnorkol","DzaLaKrte","jeVpRdre","D2-A5-Xcxwo","MOuahaha","Gorukudrik","êlp",">K<X>","Krofniam","rRrRrRr","Thymnokur","Ertko","Gtaloy","Zafalisto","Rfarokàé","2-7203-283-DX","Typhirinux","Fk-tNy","Rtai,,e","g.y;jioe",")-O-(","123465789","Ztheurx","RhYniom"];

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

	this.time = 3;
}

AlienGame.prototype = {

	init : function () {
		this.createDivs();
		this.listen();
	},

	createDivs : function () {
		this.blocs = {};
		var decal = 0;

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

			setTimeout(
				function () {
					// Add the animation property
					ag.frame.appendChild(alienBlock);
					alienBlock.classList.add("animated");
					ag.setTime(alien, alienBlock);
				},
				decal++*1000
			);
		});
	},

	setTime : function (alien, bloc) {
		window.setTimeout(function () {
			ag.frame.removeChild(bloc);
		}, ag.time*995);
	},

	listen : function () {
		this.namesLength = 0;
		for (var i=0 ; i<this.aliens.length ; i++) {
			if (this.aliens[i].name.length > this.namesLength)
				this.namesLength = this.aliens[i].name.length;
		}

		this.keyFunction = document.onkeypress;
		this.keys = new Array();
		document.onkeypress = function (event) {
			var c = String.fromCharCode(event.which);
			ag.keys.push(c);

			if (ag.keys.length > 10)
				ag.keys.shift();
			
			var txt = "";
			for (var i=0 ; i<ag.keys.length ; i++)
				txt += ag.keys[i];

			console.log(txt);
		};

	}
	
}

function Alien (name) {
	this.name = name;
	this.img = "alien.png";
}



var frame = document.getElementById("frame");
var ag = new AlienGame(frame);
ag.init();
