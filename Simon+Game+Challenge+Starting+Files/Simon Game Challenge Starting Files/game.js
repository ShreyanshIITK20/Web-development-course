var userClickedPattern = [];
var gamePattern = [];
var buttonColours = ["red","blue","green","yellow"];
var level = 0;
var started = false;

$(document).keypress(function(){                //keypress to start the game
    if(started==false){
        $("h1").text("Level "+level);
        nextSequence();
        started = true;
    }
});

//jquery code to run when we click any button
$(".btn").click(function(){
    var userChosenColour = $(this).attr('id');                  //storing ID of clicked button
    userClickedPattern.push(userChosenColour);                  //remembering the pattern 
    playSound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern.length-1)
})

function nextSequence(){
    level++;
    $("h1").text("Level "+level);

    userClickedPattern = []                                                        //re-setting the user input pattern
    
    var randomNumber = Math.floor((Math.random())*4);
    var randomChoosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChoosenColour);
    
    $("#"+randomChoosenColour).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);  //flash animation on button selected
    playSound(randomChoosenColour);                                                //sound play for button selected
}

//function to play sound on clicking
function playSound(name){
    var buttonAudio = new Audio("sounds/"+name+".mp3");
    buttonAudio.play();
}

//function to flash the button on clicking
function animatePress(currentColour){
    $("#"+currentColour).addClass("pressed");
    setTimeout(function(){
        $("#"+currentColour).removeClass("pressed");
    },100);
}

function checkAnswer(currentLevel){
    if(userClickedPattern[currentLevel]===gamePattern[currentLevel]){
        if(userClickedPattern.length===gamePattern.length){
            setTimeout(function(){
                nextSequence();
            },1000);
        }
    } else{
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(function(){
            $("body").removeClass("game-over");
        },200);
        $("h1").text("Game Over, Press Any Key to Restart");
        startover();
    }
}

function startover(){
    started = false;
    level = 0;
    gamePattern = [];
}
