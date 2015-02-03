ROOM = {
    
    'Life_Support' : {
        'status' : {
            'enabled' : {
                'oxygen' : 1
            },
            'disabled' : {
                'oxygen' : -1
            }
        }
    },
    
    'Engine_room' : {
        'status' : {
            'enabled' : {
                'speed' : 0.5
            },
            'disabled' : {
            }
        }
    },
    
    'Cockpit' : {
        'status' : {
            'enabled' : {
                'speed' : 0.5
            },
            'disabled' : {
                'oxygen' : -1
            }
        }
    },
    
    'CCTVcenter' : {
        'status' : {
            'enabled' : {
            },
            'disabled' : {
                'effect' : ['increaseSpecialEvent']
            }
        }
    },
    
    'Computer' : {
        'status' : {
            'enabled' : {
            },
            'disabled' : {
                'effect' : ['randomFaillure']
            }
        }
    },
    
    'CommandCenter' : {
        'status' : {
            'enabled' : {
            },
            'disabled' : {
            }
        }
    }
}