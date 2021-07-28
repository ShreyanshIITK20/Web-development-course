var numberOfDrums = document.querySelectorAll(".drum").length;
for(var i=0;i<numberOfDrums;i++){
    document.querySelectorAll(".drum")[i].addEventListener("click",handleClick);
}

// ABOVE TASK USING AN ANONYMOUS FUNCTION IN SECOND ARGUMENT OF addEventListener
// for(var i=0;i<numberOfDrums;i++){
//     document.querySelectorAll(".drum")[i].addEventListener("click",function () {
//         alert("I got clicked!");
//     });
// }   

function handleClick() {
    var audio = new Audio("sounds/tom-1.mp3");
    audio.play();
}

