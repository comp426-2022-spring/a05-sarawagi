// Focus div based on nav button click
const coin = document.getElementById("coinFlip");

coin.addEventListener("click", flipCoin)

async function flipCoin() {
    await fetch('http://localhost:5000/app/flip', {mode: 'cors'})
    .then(function(response){
        return response.json();
    }).then(function(json){
        //json here can be anything (not just called)
        document.getElementById("result").innerHTML = json.flip;
        document.getElementById("quarter").setAttribute("src", "assets/img/"+json.flip+".png");
        console.log(json.flip)
        console.log(json)
        //coin.disabled = true
    })
}

// Flip one coin and show coin image to match result when button clicked
// Flip multiple coins and show coin images in table as well as summary results
const coins = document.getElementById("coins")
coins.addEventListener("submit", flipCoins)
async function flipCoins(event) {
    event.preventDefault();
    const value = event.currentTarget;
    const formVal = coins.elements[0].value;
    const formEvent = event.currentTarget
    //console.log(formVal)
    const url = 'http://localhost:5000/app/flips/:' + formVal;
    //console.log(url);
    await fetch('http://localhost:5000/app/flips/' + formVal, {mode: 'cors'})
    .then(function(response){
        return response.json();
    }).then(function(json){
        document.getElementById("heads").innerHTML = "Heads: " + json.summary.heads;
        document.getElementById("tails").innerHTML = "Tails: " + json.summary.tails;
        console.log(json.summary)
        
        console.log(json)
    })
}
const call = document.getElementById('call');
call.addEventListener("submit", guessFlip);
async function guessFlip(event) {
  event.preventDefault();
  const guessVal = call.elements[0].value;
  await fetch('http://localhost:5000/app/flip/call/' + guessVal, {mode: 'cors'})
  .then(function(response){
    return response.json();
  }).then(function(json){
    document.getElementById("choice").innerHTML = "Guess was: " +json.call;
    document.getElementById("CoinGuessImg").setAttribute("src", "assets/img/" + json.call+ ".png")
    document.getElementById("actual").innerHTML = "Actual was: " +json.flip;
    document.getElementById("ActualImg").setAttribute("src", "assets/img/" + json.flip+ ".png")
    document.getElementById("results").innerHTML = "Result is: " +json.result
  })
}
// Enter number and press button to activate coin flip series
// Guess a flip by clicking either heads or tails button
function homeNav() {
    document.getElementById("homenav").className = "active";
    document.getElementById("home").className = "active";
    document.getElementById("singlenav").className = "active";
    document.getElementById("single").className = "hidden";
    document.getElementById("multinav").className = "active";
    document.getElementById("multi").className = "hidden";
    document.getElementById("guessnav").className = "active";
    document.getElementById("guess").className = "hidden";
  }
  function singleNav() {
    document.getElementById("homenav").className = "active";
    document.getElementById("home").className = "hidden";
    document.getElementById("singlenav").className = "active";
    document.getElementById("single").className = "active";
    document.getElementById("multinav").className = "active";
    document.getElementById("multi").className = "hidden";
    document.getElementById("guessnav").className = "active";
    document.getElementById("guess").className = "hidden";
  }
  function multiNav() {
    document.getElementById("homenav").className = "active";
    document.getElementById("home").className = "hidden";
    document.getElementById("singlenav").className = "active";
    document.getElementById("single").className = "hidden";
    document.getElementById("multinav").className = "active";
    document.getElementById("multi").className = "active";
    document.getElementById("guessnav").className = "active";
    document.getElementById("guess").className = "hidden";
  }
  function guessNav() {
    document.getElementById("homenav").className = "active";
    document.getElementById("home").className = "hidden";
    document.getElementById("singlenav").className = "active";
    document.getElementById("single").className = "hidden";
    document.getElementById("multinav").className = "active";
    document.getElementById("multi").className = "hidden";
    document.getElementById("guessnav").className = "active";
    document.getElementById("guess").className = "active";
  } 