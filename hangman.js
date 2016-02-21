$(document).ready(function(){

var wordList = ['guavas', 'pizza', 'awkward', 'akimbo', 'fuchsia', 'glyph', 'pyramid', 'nostril', 'mnemonic']; //all letters lowercase

var letterList = [['a','b', 'c', 'd', 'e','f','g','h','i','j','k','l','m'],['n','o', 'p', 'q', 'r','s','t','u','v','w','x','y','z']];
var guessedLetters=[];
var myWordArray = [];
var lettersArray = [];
var myWord;
var guess;
var numWrongGuesses = 0;
var maxGuesses = 10;
var divcount = 0;
var spriteIncrement = 315;

function play() {
		myReset();

    //set up the keyboard
    for (i=0; i < letterList[1].length; i++ ){
      $('#topRow').append('<div class="letterHolder clickable" id=' + letterList[0][i] + '><p class="letter">'+ letterList[0][i] +'</p></div>');
      $('#botRow').append('<div class="letterHolder clickable" id=' + letterList[1][i] + '><p class="letter">'+ letterList[1][i] +'</p></div>');
    }

    //initialize word to use, separate letters into an array
		myWord = wordList[Math.floor(Math.random()*wordList.length)];
		for (i=0; i<myWord.length; i++){
			myWordArray.push(myWord.slice(i,i+1));
		};
    console.log(myWordArray);

		//make divs for letters to go in
		for(var i = 0; i < myWordArray.length; i++){
			var newClass = "letter" + myWordArray[i];
			$("#wordDisplay").append("<div class='letterHolder " + newClass +"'></div>");
			divcount++;
			console.log(newClass);
      //set up lettersArray
      var inLettersArrayFlag = false;
      for (var j = 0; j < lettersArray.length; j++){
        if ( myWordArray[i] === lettersArray[j]){
          inLettersArrayFlag = true;
        }
      }
      if (inLettersArrayFlag === false){
        lettersArray.push(myWordArray[i]);
      }
		}

		//set width of answer display--50wide, 10padding, 1border
		var displayWidth = 42 * divcount + 20;
		displayWidth = displayWidth.toString() + "px";
		$(".wordDisplay").css("width", displayWidth);
    $('.clickable').on('click', checkLetter);
	};


  //reset the initial conditions to play again
  function myReset(){
    $('clickable').off('click', checkLetter);
    guessedLetters = [];
    myWordArray = [];
    numWrongGuesses = 0;
    lettersArray = [];
    divcount = 0;
    $('#hangmanSprite').css('left', '0px');
    $('#topRow, #botRow, #wordDisplay').empty();
    console.log('position reset to zero');
  }


  //check to see if a letter is correct
  function checkLetter(){
    //currentLetter is placeholder for the id of the letter the user guessed
    currentLetter = this.id;
    $(this).addClass('guessed').removeClass('clickable');

    //check to see whether the user has guessed that letter before
    var guessedFlag = false;
    for (var i = 0; i < guessedLetters.length; i++){
      if (currentLetter === guessedLetters[i]){
        guessedFlag = true;
      }
    }

    //check to see whether the letter is correct
    var correctFlag = false;
    if (guessedFlag === false){
      guessedLetters.push(currentLetter);
      //check and see if letter is correct
      for (var i = 0; i < lettersArray.length; i++){
        if( currentLetter === lettersArray[i]){
          correctFlag = true;
          console.log('The class to write to is .letter' + currentLetter);
          $('.letter' + currentLetter).append('<p class="letter">' + currentLetter + '</p>');
          lettersArray.splice(i,1);
        }
      }
      //if letter is wrong
      if (correctFlag === false){
        numWrongGuesses++;
        $('#hangmanSprite').css('left', -numWrongGuesses * spriteIncrement + 'px');
        console.log('position increments');
      }

      //win condition
      if(lettersArray.length === 0){
        if(confirm('You win! Play again?')){
          play();
        }
      //loss condition
      } else if (numWrongGuesses === maxGuesses){
        if (confirm('You lose! Play again?')){
          play();
        }
      }
    }
  }

  //runs game at page open
	play();


	function spriteTest (){
		$('#ninja-sprite').css('background-position', function(){
			
		})

	};

});

//TODO: add background art
//TODO: switch to spritesheet from buttons
//TODO: put in correct ninja spritesheet
//TODO: switch to using the lanterns up top
//TODO: switch to
