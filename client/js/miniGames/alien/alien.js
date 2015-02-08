
function AlienGame (frame) {

	this.frame = frame;

}

AlienGame.prototype = {

	createAlien : function () {
		var img = document.createElement("img");
		img.src = "alien.png";
		img.style.height = "30%";
		img.classList.add("alien");

		var offset = Math.random()*10 - 5;
		img.style.top = "" + (30 + offset) + "%";

		img.classList.add("animated");

		this.frame.appendChild(img);
	}

	names : [];
}	



var frame = document.getElementById("frame");
var ag = new AlienGame(frame);
ag.createAlien();
