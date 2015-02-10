// Project spaceship.
// This script contains the mini-game for the event "hack".
// It's actually a kind of mastermind.
// Author(s): barthelemy.delemotte@gmail.com .

// WARNING: the view that loads this script has to import JQuery first.

// all the symbols are placed in a module 'hack'
var hack = (function(){

    // ------
    // Public
    // ------

    // object that contains public properties of the module .
    var hack = {};

    // Start a game. Entry point of the module.
    // Options properties: 
    //     - node : the DOM element that must contains the game
    //     - alphabet: (OPTIONAL) string or array of characters (DEFAULT: a-z)
    //     - size : (OPTIONAL) the size of the secret word (DEFAULT: 4)
    //     - callback : the function to call when the game is ended
    //                  (callback params to discute)
    hack.start = function (options){
    }

    // -------
    // Private
    // -------

    // I do not deal with 'new' and 'this', because i think it leads to ugly code in
    // event-driven programming.

    // defaultAplhabet is [a-z] (someone knows a cleaner way ?)
    var defaultAlphabet = [];
    for (var i = 0; i < 26; i += 1){
        defaultAlphabet[i] = String.fromCharCode('a'.charCodeAt(0) + i);
    } 

    // default size of the secret word
    var defaultSize = 4;

    // create a new game object, options properties are same as hack.start()
    function create (options){
    }

    // create the skeleton html of the game, and add it to the node
    function buildViewSkeleton (game){
    }

    // generate the secret word. Set it directly to 'game.secret'.
    function generateSecretWord(game){
    }

    // bind the events to the callbacks:
    //  - submitting a word
    //  - text is typed
    function bindEvents (game){
    }

    // called when a charcater is typed.
    // remove characters that aren't is the alphabet.
    function textTypedHandler (game){
    }

    // called when a word has been submitted
    function submitHandler (game){
    }

    // check the user submitted statement.
    // do what's needed depending if the statement matches the solution.
    function checkPlayerStatement (game, statement){
    }

    // called if the statement isn't the solution.
    function statementFails (game, statement){
    }

    // called if the statement matches the solution.
    function statementMatches(game, statement){
    }

    return hack;

})();






