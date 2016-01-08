$(document).ready(function(){

var wordList = ['guavas'];
var letterList = [['a','b', 'c', 'd', 'e','f','g','h','i','j','k','l','m'],['n','o', 'p', 'q', 'r','s','t','u','v','w','x','y','z']];



for (i=0; i < letterList[1].length; i++ ){
  $('#topRow').append('<div class="letterHolder" id=' + letterList[0][i] + '><p class="letter">'+ letterList[0][i] +'</p></div>');
  $('#botRow').append('<div class="letterHolder" id=' + letterList[1][i] + '><p class="letter">'+ letterList[1][i] +'</p></div>');
}

// $('.letterHolder').on('click', myFunction);
//
// function myFunction(e){
//   console.log("I'm sorry Dave.");
//   console.dir(e);
//   console.log(e.target.id);
// }

$('#testDiv').click(function(){
  $.ajax({url: "test.txt", success: function(placeHolder){
    $("#testDiv").html(placeHolder);

  }})


});




});
