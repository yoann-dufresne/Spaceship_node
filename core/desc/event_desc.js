e = require('./event'),

EVENT_INHIB = 0.8;   //speed at which the inhibitors will fade away
EVENT_DENOMINATOR = 100;

EVENT = {
    
    'Fire' : {
        'type' : 'specialEvent',
        'constructor' : e.BasicEvent,
        'player' : ['Firefighter'],
        'oxygen' : -1,
        'probability' : 1,
        'max' : 2
    },
    
    'Alien' : {
        'type' : 'specialEvent',
        'constructor' : e.BasicEvent,
        'player' : ['Marine'],
        'probability' : 1,
        'max' : 1
    },
    
    'Hack' : {
        'type' : 'specialEvent',
        'constructor' : e.BasicEvent,
        'player' : ['Engineer'],
        'probability' : 1,
        'max' : 1
    },
    
    'SpaceRock' :{
        'type' : 'normalEvent',
        'constructor' : e.BasicEvent,
        'player' : [],
        'probability' : 1
    },
    
    'NoSignal' :{
        'type' : 'normalEvent',
        'constructor' : e.BasicEvent,
        'player' : [],
        'probability' : 1
    },
    
    'ElectricFailure' :{
        'type' : 'normalEvent',
        'constructor' : e.BasicEvent,
        'player' : [],
        'probability' : 1
    },
    
}