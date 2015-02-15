// Project spaceship.
// This script contains the mini-game for the event "hack".
// It's actually a kind of mastermind.
// Author(s): barthelemy.delemotte@gmail.com .

// all the symbols are placed in a module named 'hack'
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

        var game = create(options);

        generateSecretWord(game);

        buildViewSkeleton(game);

        bindEvents(game);
    }

    // -------
    // Private
    // -------

    // I do not deal with 'new' and 'this', because i think it leads to ugly code in
    // event-driven programming.

    // defaultAplhabet is [a-z] (someone knows a cleaner way ?)
    var defaultAlphabet = "";
    for (var i = 0; i < 26; i += 1){
        defaultAlphabet += String.fromCharCode('a'.charCodeAt(0) + i);
    } 

    // default size of the secret word
    var defaultSize = 4;

    // create a new game object, options properties are same as hack.start()
    function create (options){
        return {
            // the root DOM element that will contains the game
            node: options.node, 

            // function called when the game is ended/solved.
            callback: options.callback, 
            
            // the alphabet used to generate the secret word
            alphabet: options.alphabet || defaultAlphabet, 

            // the size of the secret word
            size: options.size || defaultSize,

            // a boolean that indicates if the game is ended
            ended: false,

            // a table that contains statements previously tried.
            history: [], 

            // undefined properties are initialized after.

            // the secret word that players have to find.
            secret: undefined, 

            // the DOM input element that contains the user input
            inputElement: undefined, 

            // the button used by user to submit a statement
            submitElement: undefined, 

            // the DOM table element that contains statements history
            tableElement: undefined, 
        };
    }

    // create the skeleton html of the game, and add it to the node.
    // then, initialize properties in 'game' that are elements. 
    function buildViewSkeleton (game){

        var alphabetHTML = '';
        for (var i = 0; i < game.alphabet.length; i += 1){
            alphabetHTML += game.alphabet[i];
        }

        var firstRowHTML = '';
        for (var i = 0; i < game.size; i += 1){
            firstRowHTML += '<th>?</th>';
        }

        var innerHTML = " \
            <div class='hack-wrapper'> \
                <div class='hack-input-block'> \
                    <p class='hack-alphabet'>Possibilités: "+alphabetHTML+"</p> \
                    <input id='hack-input' type='text' class='hack-input hack-error'></input> \
                    <button id='hack-submit' class='hack-submit'>↵</button> \
                </div> \
                <div class='hack-table-block'> \
                    <table id='hack-table' class='hack-table'> \
                        <tr><th>#</th>"+firstRowHTML+"</tr> \
                    </table> \
                </div> \
            </div> \
        ";

        game.node.innerHTML = innerHTML;

        game.inputElement = document.getElementById('hack-input');
        game.submitElement = document.getElementById('hack-submit');
        game.tableElement = document.getElementById('hack-table');
    }

    // generate the secret word. Set it directly to 'game.secret'.
    function generateSecretWord(game){
        // not secret for the moment.
        game.secret = "";
        for (var i = 0; i < game.size; i += 1){
            var randomIndex = Math.floor(Math.random() * game.alphabet.length);
            game.secret += game.alphabet[randomIndex];
        }
    }

    // bind the events to the callbacks:
    //  - submitting a word
    //  - text is typed
    function bindEvents (game){

        function register(element, type, callback, data){
            element.addEventListener(type, function (event){
                if (!game.ended){
                    callback.call(this, data, event);
                }
            });
        }

        register(game.inputElement, 'input', textTypedHandler, game);
        register(game.inputElement, 'keydown', maybeEnterHandler, game);
        register(game.submitElement, 'click', submitHandler, game);
    }

    // called when a charcater is typed.
    // remove characters that aren't is the alphabet.
    function textTypedHandler (game, event){

        var trueOrString = verifyUserInput(game, this.value);
        
        if (trueOrString === true){
            game.inputElement.className = "hack-input hack-valid";
            return ;
        }

        var correct = trueOrString;

        if (correct.length !== this.value.length){
            this.value = correct;
        }

        if (correct.length === game.size){
            game.inputElement.className = "hack-input hack-valid";
        } else {
            game.inputElement.className = "hack-input hack-error";
        }
    }

    // called when a word has been submitted
    function submitHandler (game, event){
        
        var statement = game.inputElement.value;
        
        if (verifyUserInput(game, statement) !== true){
            return textTypedHandler.call(game.inputElement, game);
        }

        game.inputElement.value = '';

        evalPlayerStatement(game, statement);
    }

    // called when the input text received a keydown event.
    // If the key is 'enter', then a 'submit' event is simulated.
    function maybeEnterHandler(game, event){

        if (event.keyCode === 13){
            submitHandler.call(game.submitElement, game);
        }
    }

    // verify that the input conains only charaters in the alphabet,
    // has the good size. Return a boolean true if the input is correct,
    // a string containing the corriged input otherwise (truncated,
    // bad characters removed).
    function verifyUserInput(game, input){

        var valid = true;

        if (input.length !== game.size){
            valid = false;
            input = input.slice(0, game.size);
        }

        for (var i = 0; i < input.length; /* no incr here */){
            if (game.alphabet.indexOf(input[i]) === -1){
                valid = false;
                input = input.slice(0, i) + input.slice(i+1, input.length);
            } else {
                i += 1;
            }
        }

        return valid ? true : input;
    }

    // evalutate the user submitted statement.
    // do what's needed depending if the statement matches the solution.
    function evalPlayerStatement (game, statement){

        game.history.push(statement);

        var tryNum = game.history.length;

        var rowInnerHTML = "<td>" + tryNum + "</td>";
        for (var i = 0; i < game.size; i += 1){
            var qualif = "";
            if (game.secret[i] === statement[i]){
                qualif = "good";
            }
            else if (game.secret.indexOf(statement[i]) === -1){
                qualif = "wrong";
            }
            else {
                qualif = "elsewhere";
            }
            rowInnerHTML += "<td class='hack-cell-" + qualif + "'>" + statement[i] + "</td>";
        }

        var row = document.createElement('tr');
        row.innerHTML = rowInnerHTML;

        game.tableElement.insertBefore(row, game.tableElement.childNodes[2]);


        if (game.secret === statement){
            statementMatches(game);
        }
    }

    // called if the statement matches the solution.
    function statementMatches(game){
        game.ended = true;
        game.callback();
    }

    return hack;

})();
