DEFAULT_STATUS = 'enabled';

ROOM = {
    
    'Life_Support' : {
        'status' : {
            'enabled' : {
                'oxygen' : 1
            },
            'disabled' : {
                'oxygen' : 0
            }
        }
    },
    
    'Engine_Room' : {
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
                'effect' : ['randomFailure']
            }
        }
    },
    
    'CommandCenter' : {
        'status' : {
            'enabled' : {
            },
            'disabled' : {
            }
        },
        'immune' : true
    }
}
