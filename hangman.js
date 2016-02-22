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
var spriteIncrement = 135;

function buildLetters(){
	var $topLetterRow = $('#top-letter-row');
	var $bottomLetterRow = $('#bottom-letter-row');
	for (i=0; i < letterList[1].length; i++ ){
		// $topRow.append('<div class="letterHolder clickable" id="' + letterList[0][i] + '"><p class="letter">'+ letterList[0][i] +'</p></div>');
		$topLetterRow.append('<div class="sprite-letter sprite-div clickable" id="' + letterList[0][i] + '" data-letter="' + letterList[0][i] +'"></div>');
		$('#' + letterList[0][i]).css('background-position', '-' + (i * 120).toString() + 'px 0px').css('left', (i * 60).toString() + 'px');
		// $botRow.append('<div class="letterHolder clickable" id=' + letterList[1][i] + '><p class="letter">'+ letterList[1][i] +'</p></div>');
		$bottomLetterRow.append('<div class="sprite-letter sprite-div clickable" id="' + letterList[1][i] + '" data-letter="' + letterList[1][i] +'"></div>');
		$('#' + letterList[1][i]).css('background-position', '-' + (i * 120).toString() + 'px -60px').css('left', (i * 60).toString() + 'px');
	}
}

function play() {
		myReset();

    //set up the keyboard
		// var $topRow = $('#topRow');
		//
		// var $botRow = $('#botRow');

		var $ninjaSprite = $('#ninja-sprite');
		var $gate = $('.gate');


    //initialize word to use, separate letters into an array
		myWord = wordList[Math.floor(Math.random()*wordList.length)];
		for (i=0; i<myWord.length; i++){
			myWordArray.push(myWord.slice(i,i+1));
		};
    console.log(myWordArray);


		$wordDisplay = $("#wordDisplay");
		$lanternHolder = $('#lantern-holder');
		var startX = (866 - (myWordArray.length * 98))/2;
		console.log('startX is ' + startX);
		//make divs for letters to go in
		for(var i = 0; i < myWordArray.length; i++){

			var newClass = "letter" + myWordArray[i];
			$wordDisplay.append("<div class='letterHolder " + newClass +"'></div>");
			$lanternHolder.append('<div class="sprite-div lantern-flicker' + myWordArray[i] + '" id="lantern-flicker' + i + '"></div>')
			$lanternHolder.append('<div class="lantern sprite-div ' + newClass + '" id="lantern' + i + '"><p class="lantern-letter">' + myWordArray[i] + '</p></div>');
			$('#lantern-flicker' + i).css('left', (startX -6 + (i*100)).toString() + 'px');
			$('#lantern' + i).css('left', (startX + 11 + (i*100)).toString() + 'px');
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
		$('#lantern-holder').empty();
		$('.guessed').removeClass('guessed').addClass('clickable').css('background-position', function(){
			var backgndPos = $(this).css('background-position').split(' ').map(function(current){
				return +current.replace('px', '');
			});
			return (backgndPos[0] + 60).toString() + 'px ' + backgndPos[1].toString() +'px';
		});
    $('clickable').off('click', checkLetter);
    guessedLetters = [];
    myWordArray = [];
    numWrongGuesses = 0;
    lettersArray = [];
    divcount = 0;
    $('#ninja-sprite').css('background-position', '0px 0px');
		$('.gate').css('top', '0px');
    // $('#topRow, #botRow, #wordDisplay').empty();
    console.log('position reset to zero');
		$('#top-letter-row').empty();
		$('#bottom-letter-row').empty();
		buildLetters();
  }


  //check to see if a letter is correct
  function checkLetter() {
    //currentLetter is placeholder for the id of the letter the user guessed
    var currentLetter = $(this).data('letter');
		console.log(currentLetter);
    $(this).addClass('guessed').removeClass('clickable').css('background-position', function(){
			var backgndPos = $(this).css('background-position').split(' ').map(function(current){
				return +current.replace('px', '');
			});
			return (backgndPos[0] - 60).toString() + 'px ' + backgndPos[1].toString() +'px';
		});

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
					$('.gate').css('top', '+=20px');
          console.log('The class to write to is .letter' + currentLetter);
					$('.letter' + currentLetter).css('background-position', '0px 0px').find('.lantern-letter').css('display', 'block');
					$('.lantern-flicker' + currentLetter).addClass('lantern-flicker')
          // $('.letter' + currentLetter).append('<p class="letter">' + currentLetter + '</p>');
          lettersArray.splice(i,1);
        }
      }
      //if letter is wrong
      if (correctFlag === false){
        numWrongGuesses++;

        $('#ninja-sprite').css('background-position', function(){
				return -numWrongGuesses * spriteIncrement + 'px 0px'
			});
        console.log('position increments');
      }

      //win condition
      if(lettersArray.length === 0){
				$('.gate').css('top', '220px');
        if(confirm('You win! Play again?')){
          play();
        }
      //loss condition
      } else if (numWrongGuesses === maxGuesses){

        if (confirm('You lose! The word was ' + myWord + '. Play again?')){
          play();
        }
      }
    }
  }

  //runs game at page open
	play();

});


//TODO: figure out how to make each one flicker independently, probably base is center and goes to either side at random intervals before flickering back
//TODO: prevent letters from being reclicked
