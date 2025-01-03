// Текущая суммы очков дилера и игрока
let dealerSum = 0;
let gamerSum = 0;
// Отслеживание числа тузов у участников
let dealerAceCount = 0;
let yourAceCount = 0;

let hidden; // Скрытая карта дилера
let deck = []; // Колода
let canHit = true; // сумма очков игрока не превышает 21

window.onload = function () {
  buildDeck();
  shuffleDeck();
  startGame();
};
function buildDeck() {
  let values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  let types = ["C", "D", "H", "S"];
  for (let i = 0; i < types.length; i++) {
    for (let j = 0; j < values.length; j++) {
      deck.push(values[j] + "-" + types[i]);
    }
  }
}
function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length);
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}
function createCard(cardSrc) {
  let cardImg = document.createElement("img");
  cardImg.src = cardSrc;
  cardImg.classList.add("card-img");
  return cardImg;
}

function startGame() {
  hidden = deck.pop();
  dealerSum += getValue(hidden);
  dealerAceCount += checkAce(hidden);
  let cardImg = createCard("./images/" + deck.pop() + ".png");
    dealerSum += getValue(cardImg.src);
    dealerAceCount += checkAce(cardImg.src);
    document.getElementById("dealer-cards").append(cardImg);

  for (let i = 0; i < 2; i++) {
    let cardImg = createCard("./images/" + deck.pop() + ".png");
    gamerSum += getValue(cardImg.src);
    yourAceCount += checkAce(cardImg.src);
    document.getElementById("gamer-cards").append(cardImg);
  }

  document.getElementById("gamer-sum").innerText = gamerSum;
  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stay").addEventListener("click", stay);
}

function hit() {
  if (!canHit) {
    stay()
    return;
  }
  let cardImg = createCard("./images/" + deck.pop() + ".png");
  gamerSum += getValue(cardImg.src);
  yourAceCount += checkAce(cardImg.src);

  document.getElementById("gamer-cards").append(cardImg);
  document.getElementById("gamer-sum").innerText = gamerSum;
  if (reduceAce(gamerSum, yourAceCount) > 21) {
    canHit = false;
  }
}

function stay() {

  while (dealerSum < 17) {
    let cardImg = createCard("./images/" + deck.pop() + ".png");
    dealerSum += getValue(cardImg.src);
    dealerAceCount += checkAce(cardImg.src);
    document.getElementById("dealer-cards").append(cardImg);
  }

  dealerSum = reduceAce(dealerSum, dealerAceCount);
  gamerSum = reduceAce(gamerSum, yourAceCount);

  canHit = false;
 
  document.getElementById("hidden").src = "./images/" + hidden + ".png";

  let message = "";

  if (gamerSum > 21) {
    message = "Вы проиграли!";
  } else if (dealerSum > 21) {
    message = "Дилер проиграл, вы выиграли!";
  } else if (gamerSum == dealerSum) {
    message = "Ничья!";
  } else if (gamerSum > dealerSum) {
    message = "Вы выиграли!";
  } else if (gamerSum < dealerSum) {
    message = "Вы проиграли!";
  }
  document.getElementById("dealer-sum").innerText = dealerSum;
  document.getElementById("gamer-sum").innerText = gamerSum;
  document.getElementById("results").innerText = message;
  document.getElementById("restart").style.display = "inline-block";
  document.getElementById("restart").addEventListener("click", restartGame);
}

function restartGame() {
  dealerSum = 0;
  gamerSum = 0;
  dealerAceCount = 0;
  yourAceCount = 0;
  canHit = true;
  document.getElementById("dealer-cards").innerHTML =
    '<img id="hidden" src="./images/back.png" class="card-img">';
  document.getElementById("gamer-cards").innerHTML = "";
  document.getElementById("dealer-sum").innerText = "0";
  document.getElementById("gamer-sum").innerText = "0";
  document.getElementById("results").innerText = "";
  buildDeck();
  shuffleDeck();
  startGame();
  document.getElementById("restart").style.display = "none";
}

function getValue(cardSrc) {
  let data = cardSrc.split("/").pop().split("-");
  let value = data[0];
  if (isNaN(value)) {
    if (value == "A") {
      return 11;
    }
    return 10;
  }
  return parseInt(value);
}
function checkAce(cardSrc) {
  let str = cardSrc.slice(cardSrc.indexOf('images/') + 7)

  if (str[0] == "A") {
    return 1;
  }
  return 0;
}
function reduceAce(sum, aceCount) {
  while (sum > 21 && aceCount > 0) {
    sum -= 10;
    aceCount -= 1;
  }
  return sum;
}
