var userClickedPattern = [];
var gamePattern = [];
var buttonColours = ["red","blue","green","yellow"];
function nextSequence(){
    var randomNumber = Math.floor((Math.random())*4);
    
    var randomChoosenColour = buttonColours[randomNumber];
    
    gamePattern.push(randomChoosenColour);
    
    $("#"+randomChoosenColour).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);  //flash animation on button selected
    
    playSound(randomChoosenColour);
}

$(".btn").click(function(){
    var userChosenColour = $(this).attr('id');                  //storing ID of clicked button
    userClickedPattern.push(userChosenColour);
    playSound(userChosenColour);

})

function playSound(name){
    var buttonAudio = new Audio("sounds/"+name+".mp3");
    buttonAudio.play();
}