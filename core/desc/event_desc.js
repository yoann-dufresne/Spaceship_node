try {
    var e = require('./event');
}
catch(err) {
    var e = {};
}


EVENT_INHIB = 0.8;   //speed at which the inhibitors will fade away
EVENT_DENOMINATOR = 100;

EVENT = {
    
    'Fire' : {
        'type' : 'specialEvent',
        'constructor' : e.BasicEvent,
        'player' : ['Firefighter'],
        'oxygen' : -1,
        'probability' : 1,
        'max' : 2,
		'color' : 'red'
    },
    
    'Alien' : {
        'type' : 'specialEvent',
        'constructor' : e.BasicEvent,
        'player' : ['Marine'],
        'probability' : 1,
        'max' : 1,
		'color' : 'green'
    },
    
    'Hack' : {
        'type' : 'specialEvent',
        'constructor' : e.BasicEvent,
        'player' : ['Engineer'],
        'probability' : 1,
        'max' : 1,
		'color' : 'blue'
    },
    
    'SpaceRock' :{
        'type' : 'normalEvent',
        'constructor' : e.BasicEvent,
        'player' : ['Firefighter', 'Marine', 'Engineer'],
        'probability' : 1,
		'color' : 'yellow'
    },
    
    'NoSignal' :{
        'type' : 'normalEvent',
        'constructor' : e.BasicEvent,
        'player' : ['Firefighter', 'Marine', 'Engineer'],
        'probability' : 1,
		'color' : 'yellow'
    },
    
    'ElectricFailure' :{
        'type' : 'normalEvent',
        'constructor' : e.BasicEvent,
        'player' : ['Firefighter', 'Marine', 'Engineer'],
        'probability' : 1,
		'color' : 'yellow'
    },
    
}