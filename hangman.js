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
    ninjaSpriteIncrement:        135, 
    answerOptionSpriteIncrement: 120, 
    answerOptionsLetterHeight:   60,
    lanternRodWidth:             866, 
    lanternWidth:                98, 
    gateHeight:                  200,         
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
      $('.gate').css('top', '0px');
      $('#ninja-sprite').css('background-position', '0px 0px');
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
    
    
    
    
    
    
    /**    
     * _drawWordToGuess - This draws the lanterns onto the page, although it does not draw the letters into them
     *      
     */     
    function _drawWordToGuess() {
      console.log('_drawWordToGuess');
      const $lanternHolder = $('#lantern-holder');
      $lanternHolder.empty();
      
      // Pixels from the left side of the bar, equal to half of the white space to get even spacing on both sides
      const startXPxOffset = (app.data.lanternRodWidth - (app.gameState.wordToGuess.length * app.data.lanternWidth)) / 2;
      
      for (let i = 0; i < app.gameState.wordToGuess.length; i++) {
        let xPxOffset = startXPxOffset + app.data.lanternWidth * i;
        
        $(`<li class="lantern sprite" data-index="${i}"></li>`)
          .appendTo($lanternHolder)
          .css('left', `${xPxOffset}px`);    
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
        .addClass(app.data.answerClasses[answerClassKey])
        .css('background-position', function() {
          let currentBackgroundPosition = $(this).css('background-position');
          let [currentXOffset, currentYOffset] = currentBackgroundPosition.replace(/px/g, '').split(' ');
          console.log('currentXOffset: ', currentXOffset);
          console.log('currentYOffset: ', currentYOffset);
          
          let newXOffset = currentXOffset - 60;
          
          return `${newXOffset}px ${currentYOffset}px`;
        });
      
      
      // Also update the word to guess if they guessed one of the hidden letters 
      if (correctFlag) {
        // Update the lanterns 
        app.gameState.lettersInWordToGuess[guessedLetter].indices.forEach((index) => {
          console.log('index: ', index);
          $lanterns
            .filter(`[data-index="${index}"]`)
            .css('background-position', '0px 0px')
            .append(`<p class="lantern-letter">${guessedLetter}</p>`);
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
    
    
    
    
    /**    
     * _handleCorrectAnswer - This runs if the player clicked a correct letter 
     *      
     * @param  {string} guessedLetter The letter the user guessed     
     */     
    function _handleCorrectAnswer(guessedLetter) {
      console.log('_handleCorrectAnswer');
      app.gameState.lettersInWordToGuess[guessedLetter].guessed = true;
      _updateLetters(guessedLetter, true);
      _incrementGate();
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
    
    
    
    
    /**    
     * _handleWrongAnswer - This runs if the user guesses an incorrect letter 
     *      
     * @param  {string} guessedLetter The letter the user guessed     
     */     
    function _handleWrongAnswer(guessedLetter) {
      console.log('_handleWrongAnswer');
      app.gameState.numWrongGuesses++;
      _updateLetters(guessedLetter, false);
      _showNextPartOfNinja();
      // Check and see if they lost 
      if (app.gameState.numWrongGuesses === app.data.numGuessesAllowed) {
        _gameOver(false);
      }
    }
    
    /**    
     * _gameOver - Ends the game and asks the user if they want to play again.     
     *      
     * @param  {Boolean} victoryFlag Whether the user correctly guessed the answer or not       
     */     
    function _gameOver(victoryFlag) {
      console.log('_gameOver', victoryFlag);
      
      // The setTimeout needed to get the letter to update before the new game starts 
      window.setTimeout(() => {
        let userPrompt = victoryFlag ? 'Great job! Play again?' : `Sorry, the word was ${app.gameState.wordToGuess}. Play again?`;
        let playAgain = confirm(userPrompt);
        if (playAgain) {
          app.controller.initialize();
        }
      }, 0);
    }
    
    
    function _incrementGate() {
      console.log('_incrementGate');
      
      let gateIncrement = Math.floor(app.data.gateHeight / app.gameState.wordToGuess.length);
      $('.gate').css('top', `+=${gateIncrement}`);
    }
    

    
    function _showNextPartOfNinja() {
      console.log('_showNextPartOfNinja');
      let backgroundPosition = app.gameState.numWrongGuesses * app.data.ninjaSpriteIncrement;
      
      $('#ninja-sprite').css('background-position', `-${backgroundPosition}px 0px`);
      // app.gameState.numWrongGuesses
    }
    
    
  })(),
  
  
};


app.controller.initialize();
app.controller.attachEventHandlers();
