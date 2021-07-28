var numberOfDrums = document.querySelectorAll(".drum").length;

for(var i=0;i<numberOfDrums;i++){
    document.querySelectorAll(".drum")[i].addEventListener("click",handleClick);
}  

// function to activate when a button is pressed
function handleClick() {
    var buttonInnerHTML = this.innerHTML;
    playSound(buttonInnerHTML);
    addAnimation(buttonInnerHTML);
}

// function for playing different sounds
function playSound(key){
    switch (key) {
        case "w":
            var crash = new Audio("sounds/crash.mp3");
            crash.play();
            break;
        case "a":
            var kickBass = new Audio("sounds/kick-bass.mp3");
            kickBass.play();
            break;
        case "s":
            var snare = new Audio("sounds/snare.mp3");
            snare.play();
            break;
        case "d":
            var tom1 = new Audio("sounds/tom-1.mp3");
            tom1.play();
            break;
        case "j":
            var tom2 = new Audio("sounds/tom-2.mp3");
            tom2.play();
            break;
        case "k":
            var tom3 = new Audio("sounds/tom-3.mp3");
            tom3.play();
            break;
        case "l":
            var tom4 = new Audio("sounds/tom-4.mp3");
            tom4.play();
            break;    
    }
}

// function for keypresses
document.addEventListener("keydown",function(event){
    playSound(event.key);
    addAnimation(event.key);
})

//Function to add animation
function addAnimation(currentKey){
    var activeButton = document.querySelector("."+currentKey);
    activeButton.classList.add("pressed");
    setTimeout(function(){
        activeButton.classList.remove("pressed");
    },100);
}