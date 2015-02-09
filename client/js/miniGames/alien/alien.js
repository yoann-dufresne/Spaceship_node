
function AlienGame (frame) {

	this.frame = frame;

}

AlienGame.prototype = {

	createAlien : function () {
		var alienBlock = document.createElement("div");
		alienBlock.classList.add("alien");
		var offset = Math.random()*10 - 5;
		alienBlock.style.top = "" + (30 + offset) + "%";
		alienBlock.style.height = "50%";

		var txt = document.createElement("p");
		txt.innerHTML = this.names[Math.floor(Math.random()*(this.names.length-1))];
		alienBlock.appendChild(txt);

		var img = document.createElement("img");
		img.src = "alien.png";
		img.style.display = "block";
		img.style.height = "80%";
		img.style.bottom = "0%";
		alienBlock.appendChild(img);

		alienBlock.classList.add("animated");
		img.addEventListener('webkitAnimationEnd', function (event) {img.style.display = "none";}, false);

		this.frame.appendChild(alienBlock);
	},

	names : ["Roger", "Paul", "Plitrik", "Jurmidov", "Mazuk", "Timoléon", "Pritonk", "Zglorg", "$#@&!ù%", "Jaipadnom", "Bulgroz", "Zorglub", "Althazor", "RémiBocquet", "Pritwook", "Khandivlop", "Basshunter", '"); -- ', "Rhibox", "TotoLeHaricot", "Razhul", "Ruffux", "Grosmehz"]

	
}	



var frame = document.getElementById("frame");
var ag = new AlienGame(frame);
ag.createAlien();
