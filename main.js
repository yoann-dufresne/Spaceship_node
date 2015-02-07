var express = require('express'),
    fs = require('fs');

//include js object
var s = require('./core/spaceship'),
    e = require('./core/event');

var spaceship = new s.Spaceship()

spaceship.addRoom('Life_Support')
spaceship.addRoom('Engine_Room')
spaceship.addRoom('Cockpit')
spaceship.addRoom('CCTVcenter')
spaceship.addRoom('Computer')
spaceship.addRoom('CommandCenter')

spaceship.addPlayer('Engineer')
spaceship.addPlayer('Marine')
spaceship.addPlayer('Firefighter')

spaceship.start()

//console.log(spaceship.toJson())

//simple server for client static files (everything in /client is visible)
var app = express();
app.use(express.static(__dirname + '/client'));
app.listen(process.env.PORT || 3000);

// les commandes disponible depuis les clients a l'adresse 127.0.0.1/spaceship?command=
app.get('/spaceship', function(req,res) {
    switch (req.query.command) {
        case 'getStatus':
            res.send(spaceship.toJson());
            break;
        case 'start' :
            res.send(spaceship.start());
            break;
        case 'stop' :
            res.send(spaceship.stop());
            break;
        case 'reset' :
            res.send(spaceship.reset());
            break;
    }
})

// les commandes disponible depuis les clients a l'adresse 127.0.0.1/event?player_id=XX&event_id=XXcommand=xxx
app.get('/event', function(req,res) {
    switch (req.query.command) {
        case 'solve':
            res.send(spaceship.getEventById(req.query.event_id).solve(req.query.player_id));
            break;
    }
})

