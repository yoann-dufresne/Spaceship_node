'use strict'

var fire = (function (){

  var fire = {}

  // ------
  // public
  // ------

  // start the game
  // options properties :
  //   - node : DOM element which will contains the game
  //   - callback : called when the game is ended
  //   - canvasWidth, canvasHeight: maximum size of the canvas (optional)
  //   - mapWidth, mapHeight: size of the map (optional)
  //   - snakeSize: size of the snake (without the water part) (optional)
  //   - waterStock: the starting water stock of the snake
  //   - scoreToWin: the number of fire to turn off to win the game
  fire.start = function(options){

    var core = new Core(options)

    core.renderer.draw()
  }

  // -------
  // private
  // -------

  // -----
  // Coord
  // -----
  function Coord(x, y){
    this.x = x
    this.y = y
  }

  Coord.prototype.translate = function(other){
    this.x += other.x
    this.y += other.y
  }

  Coord.prototype.equals = function(other){
    return this.x === other.x && this.y === other.y
  }

  Coord.prototype.clone = function(){
    return new Coord(this.x, this.y)
  }

  // ---------
  // Direction
  // ---------
  var DirectionEnum = {
    NORTH: 0,
    SOUTH: 1,
    EAST:  2,
    WEST:  3,
  }

  var dirTransTable = [];
  dirTransTable[DirectionEnum.NORTH] = new Coord(0,-1)
  dirTransTable[DirectionEnum.SOUTH] = new Coord(0,1)
  dirTransTable[DirectionEnum.EAST] = new Coord(1,0)
  dirTransTable[DirectionEnum.WEST] = new Coord(-1,0)

  // get a translation equivalent to a direction
  function dirToTrans(dir){
    return dirTransTable[dir].clone()
  }

  // ... the opposite, return null if the translation isn't a valid direction
  function transToDir(trans){
    for (var dir in DirectionEnum){
      if (DirectionEnum.hasOwnProperty(dir)){
        if (dirTransTable[dir].equals(trans)){
          return dir
        }
      }
    }
    return null
  }

  // ----------------
  // Defaults options
  // ----------------
  var DEFAULT_SNAKE_SIZE = 5
    , DEFAULT_CANVAS_WIDTH = 600
    , DEFAULT_CANVAS_HEIGHT = 400
    , DEFAULT_MAP_WIDTH = 20
    , DEFAULT_MAP_HEIGHT = 20
    , DEFAULT_WATER_STOCK = 3
    , DEFAULT_SNAKE_DIRECTION = DirectionEnum.NORTH
    , DEFAULT_SCORE_TO_WIN = 10

  // return value if value is not undefined, else default
  function definedElse(value, def){
    return (typeof value !== 'undefined' ? value : def)
  }

  // ----
  // Core
  // ----

  // Core constructor
  // options : same as fire.start
  function Core(options){

    this.node = options.node
    this.callback = options.callback

    this.map = new Map({
      width: definedElse(options.mapWidth, DEFAULT_MAP_WIDTH),
      height: definedElse(options.mapHeight, DEFAULT_MAP_HEIGHT)
    })

    this.snake = new Snake({
      size: definedElse(options.snakeSize, DEFAULT_SNAKE_SIZE),
      waterStock: definedElse(options.waterStock, DEFAULT_WATER_STOCK),
      direction: DEFAULT_SNAKE_DIRECTION,
      position: new Coord(
        Math.floor(this.map.width / 2),
        Math.floor(this.map.height / 2)
      )
    })

    this.renderer = new Renderer({
      core: this,
      width: definedElse(options.canvasWidth, DEFAULT_CANVAS_WIDTH),
      height: definedElse(options.canvasHeight, DEFAULT_CANVAS_HEIGHT)
    })

    this.generator = new Generator({
      core: this
    })

    // a buffer that store the last keydown event that have to be executed
    this.nextHandler = null
    this.bindEvents()

    this.scoreToWin = definedElse(options.scoreToWin, DEFAULT_SCORE_TO_WIN)
    this.score = 0
  }

  Core.prototype.bindEvents = function(){

    var that = this;

    var keydownHandlers = {
      37: function() { return that.snake.turnLeft() },
      38: function() { return that.snake.turnUp() },
      39: function() { return that.snake.turnRight() },
      40: function() { return that.snake.turnDown() }
    }

    window.addEventListener('keydown', function(event){

      if (typeof that.intervalId === 'undefined'){
        that.launch()
      }

      that.nextHandler = keydownHandlers[event.keyCode]
    })
  }

  Core.prototype.launch = function(){
    var that = this;
    this.intervalId = setInterval(function(){
      that.update()
      that.renderer.draw()
    }, 75)
  }

  Core.prototype.update = function(){
    this.nextHandler && this.nextHandler()
    this.snake.move()
    this.checkObject()
    this.checkWaterJet()
    this.checkSelfContact()
    this.generator.generate()

    if (this.score >= this.scoreToWin){
      this.callback()
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  Core.prototype.checkObject = function(){
    var head = this.snake.getHead()
      , obj = this.map.get(head)

    if (obj === null) { return }

    if (obj.type === object.Enum.FIRE){
      if (this.snake.water > 0){
        this.snake.water -= 1
        this.snake.size += 1
        this.score += 1
      }
      else {
        this.burning()
      }
    }
    else if (obj.type === object.Enum.WATER){
      this.snake.water += 1
    }

    this.map.unset(head) 
  }

  Core.prototype.checkWaterJet = function(){
    var translation = dirToTrans(this.snake.direction)
      , coord = this.snake.getHead().clone()
      , newWaterStock = this.snake.water

    for (var i = 0; i < this.snake.water; i += 1){
      coord.translate(translation)
      var obj = this.map.get(coord)
      if (obj !== null && obj.type === object.Enum.FIRE){
        newWaterStock -= 1
        this.snake.size += 1
        this.map.unset(coord)
        this.score += 1
      }
    }
    this.snake.water = newWaterStock
  }

  Core.prototype.checkSelfContact = function(){
    var head = this.snake.getHead()

    for (var i = 0; i < this.snake.body.length - 1; i += 1){
      if (head.equals(this.snake.body[i])){
        return this.selfContact()
      }
    }
  }

  Core.prototype.reset = function(){
    this.map.reset()
    this.snake.reset()

    this.score = 0
    this.nextHandler = null
  }

  Core.prototype.burning = function(){
    this.reset()
  }

  Core.prototype.selfContact = function(){
    this.reset()
  }

  // -----
  // Snake
  // -----

  // Snake is a model that contains snake data, and is used as a slave.

  // Snake contructor
  // options:
  //    - size : the initial size of the snake without the water part
  //    - position : the starting position (a object of type Coord)
  //    - direction : the starting direction
  //    - waterStock: the starting water stock
  function Snake(options){
    this.initialSize = options.size
    this.size = options.size

    // a queue data structure, fist in : tail, last in: head
    // used with push and shift
    this.body = [options.position]
    this.getHead().move = options.direction
    this.getHead().turn = options.direction

    // the current quantity of water accumulated
    this.initialWater = options.waterStock
    this.water = options.waterStock

    // the direction of the head
    this.direction = options.direction
  }

  // move the snake of 1 cell, in its current direction
  Snake.prototype.move = function(){

    var coord = this.getHead().clone()
    coord.translate(dirToTrans(this.direction))

    coord.move = this.direction
    coord.turn = this.direction

    this.body.push(coord)

    if (this.body.length > this.size){
      this.body.shift()
    }
  }

  Snake.prototype.getHead = function(){
    return this.body[this.body.length - 1]
  }

  // This commented code corresponds to a different control fashion.
  // // helper function for rotation.
  // function rotationHelper(trans, cosValue, sinValue){
  //   return new Coord(
  //     Math.floor(trans.x * cosValue - trans.y * sinValue),
  //     Math.floor(trans.x * sinValue + trans.y * cosValue)
  //   )
  // }

  // // update the snake direction by turning left
  // Snake.prototype.turnLeft = function(){
  //   var trans = dirToTrans(this.dir)
  //   this.direction = transToDir(rotationHelper(trans, 0, 1))
  // }

  // // update the snake direction by turning left
  // Snake.prototype.turnLeft = function(){
  //   var trans = dirToTrans(this.dir)
  //   this.direction = transToDir(rotationHelper(trans, 0, -1))
  // }


  // this is a standard way to control the snake with the keyboard
  Snake.prototype.turnUp =  function(){
    if (this.direction !== DirectionEnum.SOUTH){
      this.direction = DirectionEnum.NORTH
      this.getHead().turn = DirectionEnum.NORTH
    }
  }
  Snake.prototype.turnDown =  function(){
    if (this.direction !== DirectionEnum.NORTH){
      this.direction = DirectionEnum.SOUTH
      this.getHead().turn = DirectionEnum.SOUTH
    }
  }
  Snake.prototype.turnLeft =  function(){
    if (this.direction !== DirectionEnum.EAST){
      this.direction = DirectionEnum.WEST
      this.getHead().turn = DirectionEnum.WEST
    }
  }
  Snake.prototype.turnRight =  function(){
    if (this.direction !== DirectionEnum.WEST){
      this.direction = DirectionEnum.EAST
      this.getHead().turn = DirectionEnum.EAST
    }
  }

  Snake.prototype.reset = function(){
    this.body = [this.getHead()]
    this.size = this.initialSize
    this.water = this.initialWater
  }

  // ---
  // Map
  // ---

  // Map constructor
  // options:
  //    - width
  //    - height
  function Map(options){
    this.width = options.width
    this.height = options.height

    this.matrix = createMatrix(this.width, this.height, null)
  }

  function createMatrix(w, h, value){
    var matrix = [];
    for (var x = 0; x < w; x += 1){
      matrix[x] = []
      for (var y = 0; y < h; y += 1){
        matrix[x][y] = value
      }
    }
    return matrix
  }

  function positiveModulo(x, m){
    var r = x % m;
    return r >= 0 ? r : r + m
  }

  // normalize a coordinate in the toric map.
  Map.prototype.toric =  function(coord){
    return new Coord(
      positiveModulo(coord.x, this.width),
      positiveModulo(coord.y, this.height)
    )
  }

  // get an object in the map at a given coordinate
  Map.prototype.get = function(coord){
    coord = this.toric(coord)
    return this.matrix[coord.x][coord.y]
  }

  // set an object (or null), return the map for cascade.
  Map.prototype.set = function(coord, obj){
    coord = this.toric(coord)
    this.matrix[coord.x][coord.y] = obj
    return this
  }

  Map.prototype.unset =  function(coord){
    return this.set(coord, null)
  }

  Map.prototype.reset = function(){
    for (var x = 0; x < this.width; x += 1){
      for (var y = 0; y < this.height; y += 1){
        this.matrix[x][y] = null;
      }
    }
  }

  // ------
  // Object
  // ------

  // namespace object
  var object = (function(){

    var object = {}

    object.Enum = {
      FIRE: 0,
      WATER: 1
    }

    // -----------
    // Object base
    // -----------
    object.Object = function(){
    }
    object.Object.prototype.type = undefined
    object.Object.prototype.color = undefined
    object.Object.prototype.imageSrc = undefined
    object.Object.prototype.imageObj = undefined

    // ----
    // Fire
    // ----
    object.Fire = function(){
      object.Object.call(this)
    }
    // note: Object != object.Object
    object.Fire.prototype = Object.create(object.Object.prototype)
    object.Fire.prototype.type = object.Enum.FIRE
    object.Fire.prototype.color = 'red'
    object.Fire.prototype.imageObj = document.createElement('img')
    object.Fire.prototype.imageObj.src = './images/objets/feu.png'

    // -----
    // Water
    // -----
    object.Water = function(){
      object.Object.call(this)
    }
    // note: Object != object.Object
    object.Water.prototype = Object.create(object.Object.prototype)
    object.Water.prototype.type = object.Enum.WATER
    object.Water.prototype.color = 'blue'
    object.Water.prototype.imageObj = document.createElement('img')
    object.Water.prototype.imageObj.src = './images/objets/eau.png'

    return object
  })()

  // ---------
  // Generator
  // ---------

  // options :
  //  - core
  function Generator(options){
    this.core = options.core
  }

  // called at each update() to generate fire and water
  Generator.prototype.generate = function(){

    var draw = Math.random()

    if (draw < 0.03){
      this.generateWater();
    }

    if (draw > 0.95){
      this.generateFire();
    }
  }

  Generator.prototype.generatePosition = function(){
    var coord = new Coord(0,0)
      , cnt = 0

    do {
      coord.x = Math.floor(Math.random() * this.core.map.width)
      coord.y = Math.floor(Math.random() * this.core.map.width)
      cnt += 1

    } while (cnt < 20 && (this.core.map.get(coord) !== null ||
      !this.core.snake.body.every(function (x){ return !x.equals(coord) })));

    return coord;
  }

  Generator.prototype.generateWater = function(){
    this.core.map.set(this.generatePosition(), new object.Water())
  }

  Generator.prototype.generateFire = function(){
    this.core.map.set(this.generatePosition(), new object.Fire())
  }

  // --------
  // Renderer
  // --------

  // Renderer constructor
  // options:
  //    - core: the game core
  //    - width: width of the canvas
  //    - heigth: heigth of the canvas
  function Renderer(options){

    this.core = options.core

    // cells are square
    var optimalCellWidth = Math.floor(options.width / this.core.map.width)
    var optimalCellHeight = Math.floor(options.height / this.core.map.height)

    this.cellSize = Math.min(optimalCellWidth, optimalCellHeight)

    // adjust the canvas size
    this.width = this.cellSize * this.core.map.width
    this.height = this.cellSize * this.core.map.height

    this.loadImage()

    this.buildCanvas(options)
  }

  function loadImageHelper(url){
    var element = document.createElement('img')
    element.src = url
    return element
  }

  Renderer.prototype.loadImage = function(){

    this.bgImage = loadImageHelper('./images/bg.png')

    var verticalJet = loadImageHelper('./images/tuyeau/eau-vertical.png')
      , horizontalJet = loadImageHelper('./images/tuyeau/eau-horizontal.png')

    this.waterJetImages = {}
    this.waterJetImages[DirectionEnum.NORTH] = verticalJet
    this.waterJetImages[DirectionEnum.SOUTH] = verticalJet
    this.waterJetImages[DirectionEnum.WEST] = horizontalJet
    this.waterJetImages[DirectionEnum.EAST] = horizontalJet

    this.headImages = {}
    this.headImages[DirectionEnum.NORTH] = loadImageHelper('./images/tuyeau/tete-haut.png')
    this.headImages[DirectionEnum.SOUTH] = loadImageHelper('./images/tuyeau/tete-bas.png')
    this.headImages[DirectionEnum.WEST] = loadImageHelper('./images/tuyeau/tete-gauche.png')
    this.headImages[DirectionEnum.EAST] = loadImageHelper('./images/tuyeau/tete-droite.png')

    this.tailImage = loadImageHelper('./images/tuyeau/queue-tuyeau.png')

    var bodyHorizontal = loadImageHelper('./images/tuyeau/tuyeau-horizontal.png')
      , bodyVertical = loadImageHelper('./images/tuyeau/tuyeau-vertical.png')
      , bodySouthEast = loadImageHelper('./images/tuyeau/arrondi-droite-bas.png')
      , bodyNorthEast = loadImageHelper('./images/tuyeau/arrondi-droite-haut.png')
      , bodySouthWest = loadImageHelper('./images/tuyeau/arrondi-gauche-bas.png')
      , bodyNorthWest = loadImageHelper('./images/tuyeau/arrondi-gauche-haut.png')


    this.bodyImages = {}
    this.bodyImages[DirectionEnum.NORTH] = {}
    this.bodyImages[DirectionEnum.SOUTH] = {}
    this.bodyImages[DirectionEnum.EAST] = {}
    this.bodyImages[DirectionEnum.WEST] = {}

    this.bodyImages[DirectionEnum.NORTH][DirectionEnum.NORTH] = bodyVertical
    this.bodyImages[DirectionEnum.SOUTH][DirectionEnum.SOUTH] = bodyVertical
    this.bodyImages[DirectionEnum.EAST][DirectionEnum.EAST] = bodyHorizontal
    this.bodyImages[DirectionEnum.WEST][DirectionEnum.WEST] = bodyHorizontal

    this.bodyImages[DirectionEnum.NORTH][DirectionEnum.WEST] = bodySouthWest
    this.bodyImages[DirectionEnum.WEST][DirectionEnum.NORTH] = bodyNorthEast
    this.bodyImages[DirectionEnum.NORTH][DirectionEnum.EAST] = bodySouthEast
    this.bodyImages[DirectionEnum.EAST][DirectionEnum.NORTH] = bodyNorthWest

    this.bodyImages[DirectionEnum.SOUTH][DirectionEnum.WEST] = bodyNorthWest
    this.bodyImages[DirectionEnum.WEST][DirectionEnum.SOUTH] = bodySouthEast
    this.bodyImages[DirectionEnum.SOUTH][DirectionEnum.EAST] = bodyNorthEast
    this.bodyImages[DirectionEnum.EAST][DirectionEnum.SOUTH] = bodySouthWest
  }

  // called by the Renderer constructor to build the canvas
  Renderer.prototype.buildCanvas = function(){

    this.canvas = document.createElement('canvas')
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.core.node.appendChild(this.canvas)
    this.context = this.canvas.getContext('2d')
  }

  Renderer.prototype.draw = function(){
    this.drawBackground()
    this.drawMap()
    this.drawSnake()
    this.drawScore()
  }

  Renderer.prototype.drawBackground = function(){
    // this.context.fillStyle = 'black'
    // this.context.fillRect(0, 0, this.width, this.height)
    this.context.drawImage(this.bgImage, 0, 0, this.width, this.height)
  }

  Renderer.prototype.drawMap = function(){

    for (var coord = new Coord(0, 0); coord.x < this.core.map.width; coord.x += 1){
      for (coord.y = 0; coord.y < this.core.map.height; coord.y += 1){
        var obj = this.core.map.get(coord)
        if (obj !== null){
          this.drawObject(obj, coord)
        }
      }
    }
  }

  // transform map coordinate into canvas coordinate
  Renderer.prototype.mapToCanvasCoord = function(coord) {
    coord = this.core.map.toric(coord)
    var canvasX = coord.x * this.cellSize
      , canvasY = coord.y * this.cellSize
    return new Coord(canvasX, canvasY)    
  }

  Renderer.prototype.drawObject = function (obj, coord){

    var canvasCoord = this.mapToCanvasCoord(coord);

    // this.context.fillStyle = obj.color
    // this.context.fillRect(canvasCoord.x, canvasCoord.y, this.cellSize, this.cellSize)

    this.context.drawImage(obj.imageObj, canvasCoord.x, canvasCoord.y, this.cellSize, this.cellSize)
  }

  Renderer.prototype.drawSnake = function(){
    this.drawSnakeBody()
    this.drawWaterJet()
  }

  // colors of the snake
  Renderer.prototype.snakeColor = 'yellow'
  Renderer.prototype.snakeHeadColor = 'grey'
  Renderer.prototype.snakeTailColor = 'brown'
  Renderer.prototype.waterJetColor = 'cyan'

  Renderer.prototype.drawSnakeBody = function(){

    for (var i = 0; i < this.core.snake.body.length; i += 1){

      var snakePiece = this.core.snake.body[i]
        , canvasCoord = this.mapToCanvasCoord(snakePiece)
        , image = null
    

      if (i === this.core.snake.body.length - 1){
        //this.context.fillStyle = this.snakeHeadColor
        image = this.headImages[this.core.snake.direction]
      }
      else if (i === 0){
        //this.context.fillStyle = this.snakeTailColor
        image = this.tailImage
      }
      else {
        image = this.bodyImages[snakePiece.move][snakePiece.turn]
        // this.context.fillStyle = this.snakeColor
      }

      if (image === null){
        this.context.fillRect(canvasCoord.x, canvasCoord.y, this.cellSize, this.cellSize)
      }
      else {
        this.context.drawImage(image, canvasCoord.x, canvasCoord.y, this.cellSize, this.cellSize)
      }
    }
  }

  Renderer.prototype.drawWaterJet = function(){

    var translation = dirToTrans(this.core.snake.direction)
      , coord = this.core.snake.getHead().clone()
      , image = this.waterJetImages[this.core.snake.direction]

    this.context.fillStyle = this.waterJetColor

    for (var i = 0; i < this.core.snake.water; i += 1){
      coord.translate(translation)
      var canvasCoord = this.mapToCanvasCoord(coord)

      //this.context.fillRect(canvasCoord.x, canvasCoord.y, this.cellSize, this.cellSize)
      this.context.drawImage(image, canvasCoord.x, canvasCoord.y, this.cellSize, this.cellSize)
    }
  }

  Renderer.prototype.drawScore = function(){
    this.context.fillStyle = 'white'
    this.context.font = 'Bold 20pt Arial'
    this.context.fillText(this.core.score + "/" + this.core.scoreToWin, 0, 22)
  }

  return fire

})();
