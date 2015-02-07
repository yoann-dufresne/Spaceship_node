var spec = require('./spec');

module.exports.EventGenerator = EventGenerator;

function EventGenerator(spaceship) {
    console.log("-------new_eventGenerator------");
    this.spaceship = spaceship;
    this.init();
}

EventGenerator.prototype = {
    
    init : function () {
        this.proba = {}
        
        for (event in spec.EVENT){
            this.proba[event] = {
                'inhibitor' : 0.5,
                'value' : 0
            };
        };
    },
    
    /*computeProba of each event using default proba value / inhibitors / ongoing effects on spaceship
    **/
    computeProba : function () {
        for (event in this.proba){
            
            //retrieve default value
            var value = spec.EVENT[event].probability;
            
            //apply inhibitor
            value *= (1 - this.proba[event].inhibitor);  
            
            //check event in process
            var count = 0;
            var max = spec.EVENT[event].max;
            for (var i in this.spaceship.event){
                if (this.spaceship.event[i].type == event) count++;
            }
            if ( (typeof max != 'undefined') & (count >= max) ) value = 0;
            
            this.proba[event].value = value/spec.EVENT_DENOMINATOR;
        };
    },
    
    fire : function () {
        for (event in this.proba){
            if( Math.random() < this.proba[event].value){
                this.proba[event].inhibitor = 1 // this will reduce the proba to fire this event again in the next few seconds
                this.spaceship.addEvent(event)
            }
        }
    },
    
    update : function () {
        //update inhibitors value
        for (event in this.proba) this.proba[event].inhibitor *= spec.EVENT_INHIB;
        
        this.computeProba();
        this.fire();
    },
    
    toJson : function () {
        var json = this.proba;
        return json;
    }
    
};