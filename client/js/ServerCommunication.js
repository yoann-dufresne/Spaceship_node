
function ServerCommunication () {
	this.xhr = new XMLHttpRequest();
};

ServerCommunication.prototype.loadData = function (addr, callback) {
	var xhr = this.xhr;

	this.xhr.onreadystatechange  = function() {
		if(xhr.readyState  == 4) {
			if(xhr.status  == 200) {
				//console.log ("<- " + xhr.responseText);
				if (typeof callback != 'undefined')
					callback(xhr.responseText);
			}
		}
	};

	this.xhr.open("GET", addr,  true); 
	this.xhr.send(null);
}

ServerCommunication.prototype.askServer = function (pageName, args, callback) {
	var request = "http://" + document.location.host + pageName + "?t=" + Math.random();
	//console.log("-> " + request);

	for(var key in args) {
    	var value = args[key];
    	if (Array.isArray(value)) {
    		for (var i=0 ; i<value.length ; i++)
    			request  += "&" + key + "[]=" + value[i];
    	} else
	    	request += "&" + key + "=" + value;
	}

	this.loadData(request, callback);
}
