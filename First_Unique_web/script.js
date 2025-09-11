var guesses = [];
var playerCount = 0;
const field = document.querySelector("#field");
var timer;

function Start(){
    guesses = [];
    field.innerHTML = "";
    playerCount = document.querySelector("#playerCount").value*1;
    Fill();
    Visualize();
}

function Visualize(){
    let i = 0;
    timer = setInterval(() => {
        if (i == guesses.length - 1) {
            field.innerHTML += guesses[i];
            clearInterval(timer);
            Sort();
        }
        else{
            field.innerHTML += guesses[i] + ", ";
            i++;
        }
    }, 100);
}

function HighlightWinner(winner){
    let numbers = field.innerHTML.split(/,\s*/);
    let highlighted = false;
    let i = 0;
    while (!highlighted) {
        if (numbers[i] == winner) {
            highlighted = true;
            numbers[i] = `<span class="winner">${numbers[i]}</span>`;
        }
        i++;
    }
    field.innerHTML = "";
    for (let index = 0; index < numbers.length-1; index++) {
        field.innerHTML += numbers[index] + ", ";
    }
    field.innerHTML += numbers[numbers.length-1];
}

function Win(){
    if (guesses[0] != guesses[1]) {
        console.log(guesses[0]);
        HighlightWinner(guesses[0]);
        return;
    }
    let i = 1;
    while (i < guesses.length-1) {
        if (guesses[i] != guesses[i+1] && guesses[i] != guesses[i-1]) {
            console.log(guesses[i]);
            HighlightWinner(guesses[i]);
            return;
        }
        i++;
    }
    console.log("Nobody won")
}

function Sort() {
    let early = false;
    let i = 0
    while (!early && i < guesses.length) {
        let switched = false;
        for (let j = 0; j < guesses.length - i - 1; j++) {
            if (guesses[j] > guesses[j+1]) {
                Switch(j, j+1);
                switched = true;
            }
        }
        early = !switched;
        i++;
    }
    Win();
}

function Switch(a, b){
    let act = guesses[a];
    guesses[a] = guesses[b];
    guesses[b] = act;
}


function Fill() {
    for (let index = 0; index < playerCount; index++) {
        guesses.push(Random(1, 100));
    }
}

function Random(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}