$("document").ready(function () {

    var guesses = [];
    var guessesLeft = 5;
    var wins = 0;
    var word = ["acquire", "calendar", "colleague", "conscientious", "experience", "maintenance", "necessary", "occasion", "privilege", "recommend", "relevant", "separate", "successful", "compliment", "affect", "ensure", "gray", "principle", "stationary"];
    var matchedLetters = [];
    var chosen;
    var chosenLetters = [];
    var def = ["buy or obtain for oneself", "a chart or series of pages showing the days, weeks and months of a particular year", "a person with whom one works with", "wishing to do what is right", "practical contact with and observation of facts or events", "the process of maintaining someone or something", "required to be done, achieved, or present", "a particular time or instance of an event", "a special right, advantage, or immunity granted or available only to a particular person or group", "put forward (someone or something) with approval as being suitable for a particular purpose or role.", "closely connected or appropriate to what is being done or considered", "forming or viewed as a unit apart or by itself", "accomplishing an aim or purpose", "a polite expression of praise or admiration", "have an effect on; make a difference to", "make certain that (something) shall occur or be the case", "of a color intermediate between black and white, as of ashes or lead", "a fundamental truth or proposition that serves as the foundation for a system of belief or behavior or for a chain of reasoning", "not moving or not intended to be moved"];  




    function pickWord() {
        var index = Math.floor(Math.random() * word.length);
        chosen = word[index];
        chosenLetters = chosen.split("");
        wordView();
        updateLives();
        $('#define').html("<b>Definition:</b> " + def[index]);
    }



    function updateGuess(e) {
        for (var i = 0; i < chosenLetters.length; i++) {
            if (e === chosenLetters[i]) {
                if (matchedLetters.indexOf(e) == -1) {
                    matchedLetters.push(e);
                }
            }
        }
        if (guesses.indexOf(e) == -1) {
            guesses.push(e);
            if (chosenLetters.indexOf(e) == -1) {
                guessesLeft--;
            }
        }
        guesses.sort();
        $('#guess').text(guesses);
        return new Promise(function (res, rej) {
            res('guess')
        });
    }

    function updatePage(e) {
        if (guessesLeft < 1) {
            end();
        }
        else {
            $('#wins').text(wins);
            return updateGuess(e).then(wordView).then(updateWin).then(updateLives);;
        }
    }

    function wordView() {
        var blanks = "";
        for (var i = 0; i < chosenLetters.length; i++) {
            if (matchedLetters.indexOf(chosenLetters[i]) !== -1) {
                blanks = blanks + chosenLetters[i];
            }
            else {
                blanks = blanks + " _ ";
            }
        }
        $('#word').html(blanks);
        return new Promise(function (res, rej) {
            res('view')
        });

    }

    function updateLives() {
        $("#lives").html(guessesLeft);
    }

    function end() {
        if (confirm('Game over! Play again?')){
            wins = 0
            nextGame();
        }
        else{
            return true;
        }
    }

    function updateWin() {
        if ($('#word').text() === chosen) {
            var sound = $('#winSound');
            setTimeout(function(){
                sound[0].play();
                wins++
                nextGame();
            }, 500);
        }
        return new Promise(function (res, rej) {
            res('Win');
        })
    }

    function nextGame(){
        guesses = [];
        guessesLeft = 6;
        matchedLetters = [];
        chosen = null;
        chosenLetters = null;
        pickWord();
        wordView();
        updatePage();
    }
    // Record the guesses
    $(document).on("keypress", function (e) {
        var k = e.keyCode;
        if ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8){
            updatePage(e.key);
            // wordView();
        }
    })
    pickWord();
})






