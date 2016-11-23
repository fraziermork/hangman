'use strict';

const app = {
  
  // Underlying data 
  data: {
    // TODO: Think of a couple more words that would be good 
    possibleWordsToGuess: ['guavas', 'pizza', 'awkward', 'akimbo', 'fuchsia', 'glyph', 'pyramid', 'nostril', 'mnemonic'],
    numGuessesAllowed:    10, 
    letterList:           (function() {
      let charCodeOfLowercaseA = 97;
      let numberOfLetters      = 26;
      let letterList           = [];
      for (var i = 0; i < numberOfLetters; i++) {
        letterList.push(String.fromCharCode(i + charCodeOfLowercaseA));
      }
      return letterList;
    })(), 
    
      // Data only relevant for drawing to the page 
    spriteIncrement:             135, 
    answerOptionSpriteIncrement: 120, 
    answerOptionsLetterHeight:   60,
    lanternRodWidth:             866, 
    lanternWidth:                98, 
    answerLetterListId:          '#answer-letter-list', 
    
    // Classes to be applied to letters in the answer options keyboard to show whether they were correct or wrong
    // Using 'wrong' instead of 'incorrect' for readability
    answerClasses: {
      correct: 'is-correct', 
      wrong:   'is-wrong',
    },
  },

  // Properties set by controller.initialize that manage the game state
  gameState: {},
  
  // Contains the methods that control the game 
  controller: (function() {
    return {
      initialize, 
      handleLetterClick,
      attachEventHandlers,
    };
    
    // ////////////////////////////////////////////////////////////////////////////
    // Public methods published on controller object
    // ////////////////////////////////////////////////////////////////////////////
    
    
    /**    
     * initialize - This sets or resets the initial conditions needed to play 
     *         
     */     
    function initialize() {
      console.log('initialize');
      _initializeGameState();
      _drawAnswerOptionLetters();
      _drawWordToGuess();
      
    }
    
    
    
    /**    
     * attachEventHandlers - Attaches event handlers to appropriate elements--only runs once on page load
     */     
    function attachEventHandlers() {
      console.log('attachEventHandlers');
      $(app.data.answerLetterListId).on('click', app.controller.handleLetterClick);
    }
    
    
    
    /**    
     * handleLetterClick - Runs as an event handler whenever a letter is clicked. 
     *      
     * @param  {object} event The click event object          
     */     
    function handleLetterClick(event) {
      console.log('handleLetterClick ', event.target.dataset.letter, event);
      console.log('this: ', this);
      
      
      // Break out if ul clicked, not an li 
      if (!event.target.dataset.letter) return;
      
      _checkAnswer(event.target.dataset.letter);
    }
    
    
    
    // ////////////////////////////////////////////////////////////////////////////
    // Private methods used only within the controller
    // ////////////////////////////////////////////////////////////////////////////
    
    /**    
     * _initializeGameState - Resets the game state to initial values 
     *      
     * @return {object} The new gameState      
     */     
    function _initializeGameState() {
      console.log('_initializeGameState');
      let wordToGuess = _generateWordToGuess();
      app.gameState = {
        wordToGuess,
        numWrongGuesses:      0, 
        wordsAlreadyGuessed:  [], 
        guessedLetters:       [], 
        
        // Object managing letters in the word, with a flag for whether they've been guessed and an array of indices where they are in the word
        lettersInWordToGuess: (function() {
          let lettersInWordToGuess = wordToGuess.split('')
            .reduce((acc, letter, i) => {
              if (!acc[letter]) {
                acc[letter] = {
                  guessed: false, 
                  indices: [i],
                };
              } else {
                acc[letter].indices.push(i);
              }
              return acc;
            }, {});
          console.log('lettersInWordToGuess: ', lettersInWordToGuess);  
          return lettersInWordToGuess;
        })(),
      };
      return app.gameState;
    }
    
    
    /**    
     * _generateWordToGuess - Chooses a word at random for the user to guess that they haven't already been asked to guess. 
     *      
     * @return {string}  The word that the user will be trying to guess.       
     */     
    function _generateWordToGuess() {
      console.log('_generateWordToGuess');
      let wordToGuess = _generateRandomValue(app.data.possibleWordsToGuess, app.gameState.wordsAlreadyGuessed);
      return wordToGuess;
    }
    
    
    /**    
     * _generateRandomValue - Generates a random value from an array, and optionally prevents a selection of a value already in arrayToCheckForDuplicates.     
     *      
     * @param  {Array} arrayToGetValueFrom         The array containing the possible values, of which one will be chosen      
     * @param  {Array} [arrayToCheckForDuplicates] An optional array of values to check selected values against and prevent duplicates with. Will push the chosen value into it to prevent duplicates in the future.       
     * @return {*}                                 The chosen value from arrayToGetValueFrom
     */     
    function _generateRandomValue(arrayToGetValueFrom, arrayToCheckForDuplicates = []) {
      console.log('_generateRandomValue');
      let randomValue = null;
      while (!randomValue || arrayToCheckForDuplicates.indexOf(randomValue) !== -1) {
        let randomIndex = Math.floor(Math.random() * arrayToGetValueFrom.length);
        randomValue = arrayToGetValueFrom[randomIndex];
      }
      console.log('randomValue: ', randomValue);
      arrayToCheckForDuplicates.push(randomValue);
      return randomValue;
    }
    
    
    
    
    /**    
     * _drawAnswerOptionLetters - This draws the letters onto the page that the user will click to make their guesses    
     *          
     */     
    function _drawAnswerOptionLetters() {
      console.log('_drawAnswerOptionLetters');
      const $answerLetterList = $(app.data.answerLetterListId);
      console.log($answerLetterList);
      $answerLetterList.empty();
      
      console.log('app.data.letterList.length: ', app.data.letterList.length);
      
      app.data.letterList.forEach((letter, i) => {
        let xPxOffset = -i * app.data.answerOptionSpriteIncrement;
        let yPxOffset = app.data.answerOptionsLetterHeight * Math.floor(i / (app.data.letterList.length / 2));
        
        // Create 
        $(`<li class="sprite sprite-letter is-clickable" data-letter="${letter}"></li>`)
          .appendTo($answerLetterList)  
          .css('background-position', `${xPxOffset}px ${yPxOffset}px`);
      });
    }
    
    
    
    function _drawWordToGuess() {
      console.log('_drawWordToGuess');
      const $lanternHolder = $('#lantern-holder');
      
      
      
      
      for (let i = 0; i < app.gameState.wordToGuess.length; i++) {
        let xOffset = 0;
        let yOffset = 0;
        
        $(`<li class="lantern sprite" data-index="${i}"></li>`)
          .appendTo($lanternHolder);
          // .css()
        app.gameState.wordToGuess[i];
      }
      
      
      
    }
    
    
    
    
    /**    
     * _updateLetters - This adds classes as appropriate to the answer option letters and to the letters in the word being guessed 
     *      
     * @param  {String}   guessedLetter   The letter that was guessed     
     * @param  {Boolean} [correctFlag]    Whether the letter was a correct guess or not, defaults to wrong      
     */     
    function _updateLetters(guessedLetter, correctFlag) {
      const $lanterns       = $('.lantern');
      const answerClassKey = correctFlag ? 'correct' : 'wrong';
      
      $(`.sprite-letter.is-clickable[data-letter="${guessedLetter}"]`)
        .removeClass('is-clickable')
        .addClass(app.data.answerClasses[answerClassKey]);
      
      
      // Also update the word to guess if they guessed one of the hidden letters 
      if (correctFlag) {
        // Update the lanterns 
        app.gameState.lettersInWordToGuess[guessedLetter].indices.forEach((index) => {
          console.log('index: ', index);
          $lanterns.filter(`[data-index="${index}"]`).append(`<p class="lantern-letter">${guessedLetter}</p>`);
          
        });
      }
    }
    
    
    /**    
     * _checkAnswer - Checks whether the user's guess was correct or not    
     *      
     * @param  {String} guessedLetter  Which letter the user guessed     
     * @return {Boolean}               Whether the letter was correct or not      
     */     
    function _checkAnswer(guessedLetter) {
      console.log('checkAnswer', guessedLetter);
      
      // Don't do anything if they've already guessed that letter
      if (app.gameState.guessedLetters.indexOf(guessedLetter) !== -1) {
        console.log(`Letter ${guessedLetter} has already been guessed.`);
        return;
      }
      
      app.gameState.guessedLetters.push(guessedLetter);
      
      // handle correct or incorrect answers 
      if (app.gameState.wordToGuess.includes(guessedLetter)) {
        console.log(`Letter ${guessedLetter} was correct.`);
        return _handleCorrectAnswer(guessedLetter);
      } 

      return _handleWrongAnswer(guessedLetter);
    }
    
    
    
    
    function _handleCorrectAnswer(guessedLetter) {
      console.log('_handleCorrectAnswer');
      _updateLetters(guessedLetter, true);
      
      // Check and see if they won 
      let allLettersGuessed = Object.keys(app.gameState.lettersInWordToGuess)
        .reduce((acc, letter) => {
          if (!acc || !app.gameState.lettersInWordToGuess[letter].guessed) {
            return false;
          }
          return true;
        }, true);
      
      if (allLettersGuessed) {
        _gameOver(true);
      }
    }
    
    function _handleWrongAnswer(guessedLetter) {
      console.log('_handleWrongAnswer');
      app.gameState.numWrongGuesses++;
      _updateLetters(guessedLetter, false);
      
      // Check and see if they lost 
      if (app.gameState.numWrongGuesses === app.data.numGuessesAllowed) {
        _gameOver(false);
      }
    }
    
    /**    
     * _gameOver - description    
     *      
     * @param  {Boolean} victoryFlag Whether the user correctly guessed the answer or not      
     * @return {type}                description     
     */     
    function _gameOver(victoryFlag) {
      console.log('_gameOver', victoryFlag);
      
      
    }
    
    
  })(),
  
  
};


app.controller.initialize();
app.controller.attachEventHandlers();







// const app = {
// 
//   // Methods 
//   initialize() {
//     console.log('INITIALIZE');
//     this.play();
//   }, 
//   
//   
//   /**  
//    * reset - resets data to initial values
//    *    
//    * @return {type}  description   
//    */   
//   reset() {
//     console.log('RESET');
//     if (this.wordToGuess) this.wordsAlreadyGuessed.push(this.wordToGuess);
//     this.wordToGuess          = this.chooseWordToGuess(); 
//     this.currentGuessedLetter = null;
//     this.numWrongGuesses      = 0; 
//     this.guessedLetters       = [];
//   }, 
//   
//   
//   chooseWordToGuess() {
//     console.log('CHOOSE WORD TO GUESS');
//     return this.generateRandomValue(this.possibleWordsToGuess, this.wordsAlreadyGuessed);
//   }, 
//   
//   drawInitialLetters() {
//     console.log('DRAW INITIAL LETTERS');
//     // const allLetterRowsWrapper = $('#letter-row-wrapper');
//     const letterRowTemplate    = Handlebars.compile($('#letter-row-template').html());
//     
//     for (let rowIndex = 0; rowIndex < this.letterRowIds.length; rowIndex++) {
//       let rowToHoldLetters     = $(`#${this.letterRowIds[rowIndex]}`); 
//       let rowLength            = Math.floor(this.letterList.length / this.letterRowIds.length);
//       let firstIndex           = rowIndex * rowLength;
//       let lastIndex            = firstIndex + rowLength - 1;
//       let lettersForThisRow    = this.letterList.slice(firstIndex, lastIndex);
//       
//       // Append the row to the DOM 
//       rowToHoldLetters.empty();
//       rowToHoldLetters.append(letterRowTemplate({
//         letters: lettersForThisRow,
//       }));  
//     }
//   }, 
//   
//   
//   
//   
//   /**  
//    * play - This is the main method that runs the game and restarts it after a victory or loss 
//    *      
//    */   
//   play() {
//     console.log('PLAY');
//     this.reset();
//     this.drawInitialLetters();
//   },
//   
//   
//   
//   
//   /**  
//    * generateRandomValue - Returns a random, valid entry
//    *    
//    * @param  {array} arrayToGenerateRandomIndexFrom   An array to choose a value from 
//    * @param  {array} [arrayToCheckForDuplicates]      An array of similar values that must be checked to prevent duplicates, defaults to an empty array    
//    * @return {*}                                      A single value from arrayToGenerateRandomIndexFrom that isn't a duplicate of any values in arrayToCheckForDuplicates
//    */   
  // generateRandomValue(arrayToGenerateRandomIndexFrom, arrayToCheckForDuplicates = []) {
  //   console.log('GENERATE RANDOM VALUE');
  //   let randomValue = null;
  //   while (!randomValue || arrayToCheckForDuplicates.indexOf(randomValue) !== -1) {
  //     let randomIndex = Math.floor(Math.random() * arrayToGenerateRandomIndexFrom.length);
  //     randomValue = arrayToGenerateRandomIndexFrom[randomIndex];
  //   }
  //   console.log('randomValue: ', randomValue);
  //   return randomValue;
  // },
//   
//   checkAnswer(event) {
//     console.log('CHECK ANSWER');
//     
//     
//   },
//   
//   handleCorrectAnswer() {
//     console.log('HANDLE CORRECT ANSWER');
//     
//     
//   }, 
//   
//   handleWrongAnswer() {
//     console.log('HANDLE WRONG ANSWER');
//     
//     
//   }, 
//   
//   
//   
//   handleGameEnd() {
//     console.log('HANDLE GAME END');
//     
//     
//   },
//   
// };
// 
// 
// $(document).ready(function(){
//   app.initialize();
// 
// // var wordList = ['guavas', 'pizza', 'awkward', 'akimbo', 'fuchsia', 'glyph', 'pyramid', 'nostril', 'mnemonic']; //all letters lowercase
// 
// // var letterList = [
// //   ['a','b', 'c', 'd', 'e','f','g','h','i','j','k','l','m'],
// //   ['n','o', 'p', 'q', 'r','s','t','u','v','w','x','y','z']
// // ];
// // var guessedLetters=[];
// // var myWordArray = [];
// // var lettersArray = [];
// // var myWord;
// // var guess;
// // var numWrongGuesses = 0;
// // var maxGuesses = 10;
// // var divcount = 0;
// // var spriteIncrement = 135;
// 
// 
// 
// 
// // function buildLetters(){
// // 	var $topLetterRow = $('#top-letter-row');
// // 	var $bottomLetterRow = $('#bottom-letter-row');
// // 	for (i=0; i < letterList[1].length; i++ ){
// // 		// $topRow.append('<div class="letterHolder clickable" id="' + letterList[0][i] + '"><p class="letter">'+ letterList[0][i] +'</p></div>');
// // 		$topLetterRow.append('<div class="sprite-letter sprite-div clickable" id="' + letterList[0][i] + '" data-letter="' + letterList[0][i] +'"></div>');
// // 		$('#' + letterList[0][i]).css('background-position', '-' + (i * 120).toString() + 'px 0px').css('left', (i * 60).toString() + 'px');
// // 		// $botRow.append('<div class="letterHolder clickable" id=' + letterList[1][i] + '><p class="letter">'+ letterList[1][i] +'</p></div>');
// // 		$bottomLetterRow.append('<div class="sprite-letter sprite-div clickable" id="' + letterList[1][i] + '" data-letter="' + letterList[1][i] +'"></div>');
// // 		$('#' + letterList[1][i]).css('background-position', '-' + (i * 120).toString() + 'px -60px').css('left', (i * 60).toString() + 'px');
// // 	}
// // }
// 
// // function play() {
// // 		myReset();
// // 
// //     //set up the keyboard
// // 		// var $topRow = $('#topRow');
// // 		//
// // 		// var $botRow = $('#botRow');
// // 
// // 		var $ninjaSprite = $('#ninja-sprite');
// // 		var $gate = $('.gate');
// // 
// // 
// //     //initialize word to use, separate letters into an array
// // 		myWord = wordList[Math.floor(Math.random()*wordList.length)];
// // 		for (i=0; i<myWord.length; i++){
// // 			myWordArray.push(myWord.slice(i,i+1));
// // 		};
// //     console.log(myWordArray);
// // 
// // 
// // 		$wordDisplay = $("#wordDisplay");
// // 		$lanternHolder = $('#lantern-holder');
// // 		var startX = (866 - (myWordArray.length * 98))/2;
// // 		console.log('startX is ' + startX);
// // 		//make divs for letters to go in
// // 		for(var i = 0; i < myWordArray.length; i++){
// // 
// // 			var newClass = "letter" + myWordArray[i];
// // 			$wordDisplay.append("<div class='letterHolder " + newClass +"'></div>");
// // 			$lanternHolder.append('<div class="sprite-div lantern-flicker' + myWordArray[i] + '" id="lantern-flicker' + i + '"></div>')
// // 			$lanternHolder.append('<div class="lantern sprite-div ' + newClass + '" id="lantern' + i + '"><p class="lantern-letter">' + myWordArray[i] + '</p></div>');
// // 			$('#lantern-flicker' + i).css('left', (startX -6 + (i*100)).toString() + 'px');
// // 			$('#lantern' + i).css('left', (startX + 11 + (i*100)).toString() + 'px');
// // 			divcount++;
// // 			console.log(newClass);
// //       //set up lettersArray
// //       var inLettersArrayFlag = false;
// //       for (var j = 0; j < lettersArray.length; j++){
// //         if ( myWordArray[i] === lettersArray[j]){
// //           inLettersArrayFlag = true;
// //         }
// //       }
// //       if (inLettersArrayFlag === false){
// //         lettersArray.push(myWordArray[i]);
// //       }
// // 		}
// // 
// // 		//set width of answer display--50wide, 10padding, 1border
// // 		var displayWidth = 42 * divcount + 20;
// // 		displayWidth = displayWidth.toString() + "px";
// // 		$(".wordDisplay").css("width", displayWidth);
// //     $('.clickable').on('click', checkLetter);
// // 	};
// 
// 
//   //reset the initial conditions to play again
//   // function myReset(){
// 	// 	$('#lantern-holder').empty();
// 	// 	$('.guessed').removeClass('guessed').addClass('clickable').css('background-position', function(){
// 	// 		var backgndPos = $(this).css('background-position').split(' ').map(function(current){
// 	// 			return +current.replace('px', '');
// 	// 		});
// 	// 		return (backgndPos[0] + 60).toString() + 'px ' + backgndPos[1].toString() +'px';
// 	// 	});
//   //   $('clickable').off('click', checkLetter);
//   //   guessedLetters = [];
//   //   myWordArray = [];
//   //   numWrongGuesses = 0;
//   //   lettersArray = [];
//   //   divcount = 0;
//   //   $('#ninja-sprite').css('background-position', '0px 0px');
// 	// 	$('.gate').css('top', '0px');
//   //   // $('#topRow, #botRow, #wordDisplay').empty();
//   //   console.log('position reset to zero');
// 	// 	$('#top-letter-row').empty();
// 	// 	$('#bottom-letter-row').empty();
// 	// 	buildLetters();
//   // }
// 
// 
//   //check to see if a letter is correct
//   // function checkLetter() {
//   //   //currentLetter is placeholder for the id of the letter the user guessed
//   //   var currentLetter = $(this).data('letter');
// 	// 	console.log(currentLetter);
//   //   $(this).addClass('guessed').removeClass('clickable').css('background-position', function(){
// 	// 		var backgndPos = $(this).css('background-position').split(' ').map(function(current){
// 	// 			return +current.replace('px', '');
// 	// 		});
// 	// 		return (backgndPos[0] - 60).toString() + 'px ' + backgndPos[1].toString() +'px';
// 	// 	});
//   // 
//   //   //check to see whether the user has guessed that letter before
//   //   var guessedFlag = false;
//   //   for (var i = 0; i < guessedLetters.length; i++){
//   //     if (currentLetter === guessedLetters[i]){
//   //       guessedFlag = true;
//   //     }
//   //   }
//   // 
//   //   //check to see whether the letter is correct
//   //   var correctFlag = false;
//   //   if (guessedFlag === false){
//   //     guessedLetters.push(currentLetter);
//   //     //check and see if letter is correct
//   //     for (var i = 0; i < lettersArray.length; i++){
//   //       if( currentLetter === lettersArray[i]){
//   //         correctFlag = true;
// 	// 				$('.gate').css('top', '+=20px');
//   //         console.log('The class to write to is .letter' + currentLetter);
// 	// 				$('.letter' + currentLetter).css('background-position', '0px 0px').find('.lantern-letter').css('display', 'block');
// 	// 				$('.lantern-flicker' + currentLetter).addClass('lantern-flicker')
//   //         // $('.letter' + currentLetter).append('<p class="letter">' + currentLetter + '</p>');
//   //         lettersArray.splice(i,1);
//   //       }
//   //     }
//   //     //if letter is wrong
//   //     if (correctFlag === false){
//   //       numWrongGuesses++;
//   // 
//   //       $('#ninja-sprite').css('background-position', function(){
// 	// 			return -numWrongGuesses * spriteIncrement + 'px 0px'
// 	// 		});
//   //       console.log('position increments');
//   //     }
//   // 
//   //     //win condition
//   //     if(lettersArray.length === 0){
// 	// 			$('.gate').css('top', '220px');
//   //       if(confirm('You win! Play again?')){
//   //         play();
//   //       }
//   //     //loss condition
//   //     } else if (numWrongGuesses === maxGuesses){
//   // 
//   //       if (confirm('You lose! The word was ' + myWord + '. Play again?')){
//   //         play();
//   //       }
//   //     }
//   //   }
//   // }
// 
//   //runs game at page open
// 	// play();
// 
// });


// TODO: figure out how to make each one flicker independently, probably base is center and goes to either side at random intervals before flickering back
// TODO: prevent letters from being reclicked
// TODO: get the gate close and game loss to be consistent with when the figure is completed
// TODO: get the gate to actually close 


// letterList:           [
//   { letter: 'a' }, 
//   { letter: 'b' }, 
//   { letter: 'c' }, 
//   { letter: 'd' }, 
//   { letter: 'e' }, 
//   { letter: 'f' }, 
//   { letter: 'g' }, 
//   { letter: 'h' }, 
//   { letter: 'i' }, 
//   { letter: 'j' }, 
//   { letter: 'k' }, 
//   { letter: 'l' }, 
//   { letter: 'm' }, 
//   { letter: 'n' }, 
//   { letter: 'o' }, 
//   { letter: 'p' }, 
//   { letter: 'q' }, 
//   { letter: 'r' }, 
//   { letter: 's' }, 
//   { letter: 't' }, 
//   { letter: 'u' }, 
//   { letter: 'v' }, 
//   { letter: 'w' }, 
//   { letter: 'x' }, 
//   { letter: 'y' }, 
//   {letter: ' z' },
// ],
