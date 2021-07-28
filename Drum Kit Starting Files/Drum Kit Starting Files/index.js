var numberOfDrums = document.querySelectorAll(".drum").length;
for(var i=0;i<numberOfDrums;i++){
    document.querySelectorAll(".drum")[i].addEventListener("click",handleClick);
}

function handleClick() {
    alert("I got clicked!");
}