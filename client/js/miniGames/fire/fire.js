
var fire = (function (){

  var fire = {}

  // ------
  // public
  // ------

  // start the game
  // options properties :
  //   - node : DOM element which will contains the game
  //   - callback : called when the game is ended
  fire.start = function(options){

    var core = new Core(options)

    core.launch();
  }

  // -------
  // private
  // -------

  // ----
  // Core
  // ----
  function Core(options){
  }

  Core.prototype.launch = function(){
  }

  Core.prototype.update = function(){
  }

  // -----
  // Snake
  // -----
  function Snake(options){
  }

  Snake.prototype.move = function(){
  };

  // ---------
  // Direction
  // ---------

  var DirectionEnum = {
    NORTH: 0
  , SOUTH: 1
  , EAST:  2
  , WEST:  3
  }

  DirectionEnum.turnLeft = function(dir) {
  } 

  DirectionEnum.turnRight = function(dir) {
  }

  // ---
  // Map
  // ---
  function Map(options){
  }

  Map.prototype.get = function(x, y){
  }

  Map.prototype.set = function(x, y, obj){
  }

  Map.prototype.unset =  function(x, y){
    return this.set(x, y, null);
  }

  // ---------
  // Generator
  // ---------
  function Generator(options){
  }

  Generator.prototype.generate = function(){
  }

  // --------
  // Renderer
  // --------
  function Renderer(options){
  }

  Renderer.prototype.draw = function(){
  }

  return fire

})();
