$(document).ready(function(){

var wordList = ['guavas']; //all letters lowercase

var letterList = [['a','b', 'c', 'd', 'e','f','g','h','i','j','k','l','m'],['n','o', 'p', 'q', 'r','s','t','u','v','w','x','y','z']];
var guessedLetters=[];
var myWordArray = [];
var myWord;
var guess;
var numWrongGuesses = 0;
var maxGuesses = 10;
var divcount = 0;

//set up the keyboard
for (i=0; i < letterList[1].length; i++ ){
  $('#topRow').append('<div class="letterHolder clickable" id=' + letterList[0][i] + '><p class="letter">'+ letterList[0][i] +'</p></div>');
  $('#botRow').append('<div class="letterHolder clickable" id=' + letterList[1][i] + '><p class="letter">'+ letterList[1][i] +'</p></div>');
}

function play() {
		//clear garbage from previous runs
		myReset();

    //initialize word to use, separate letters into an array
		myWord = wordList[Math.floor(Math.random()*wordList.length)];
		for (i=0; i<myWord.length; i++){
			myWordArray.push(myWord.slice(i,i+1));
		};
		console.log(myWordArray);

		//make divs for letters to go in
		for(i = 0; i < myWordArray.length; i++){
			newID = "letter" + i.toString();
			$("#wordDisplay").append("<div class='letterHolder' id ="+ newID +"></div>");
			divcount++;
			console.log(newID);
			//"<div class='letterDisplay' id='letter'+"divcount "></div>")
		}

		//set width of answer display--50wide, 10padding, 1border
		var displayWidth = 52 * divcount + 10;
		displayWidth = displayWidth.toString() + "px";
		$("#wordDisplay").css("width", displayWidth);
	};

  //reset the initial conditions to play again
  function myReset(){
    guessedLetters = [];
    myWordArray = [];
    numWrongGuesses = 0;
  }


  //check to see if a letter is correct
  function checkLetter(){
    //currentLetter is placeholder for the id of the letter the user guessed
    currentLetter = this.id;
    console.dir(this);
    $(this).removeClass('clickable').addClass('guessed');
    console.dir(this);

    //check to see whether the user has guessed that letter before
    var guessedFlag = false;
    for (var i = 0; i < guessedLetters.length; i++){
      if (currentLetter === guessedLetters[i]){
        guessedFlag = true;
      }
    }
    if (guessedFlag === false){
      guessedLetters.push(currentLetter);
    }
    console.log(guessedFlag);
    console.log('checking letter ' + this.id);
  }



  //runs game at page open
	play();
  $('.clickable').on('click', checkLetter);







// $('.letterHolder').on('click', myFunction);
//
// function myFunction(e){
//   console.log("I'm sorry Dave.");
//   console.dir(e);
//   console.log(e.target.id);
// }
// $('#testDiv').click(function(){
//   $.ajax({url: "test.txt", success: function(placeHolder){
//     $("#testDiv").html(placeHolder);
//   }})
// });




});
