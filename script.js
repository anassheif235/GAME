const emojis = ['🍎','🍌','🍇','🍉','🍓','🍍','🍒','🥝'];
let cards = [];
let flippedCards = [];
let lockBoard = false;
let tries = 0;
let startTime;
let timerInterval;

const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("tries");
const timerDisplay = document.getElementById("timer");
const message = document.getElementById("message");

const matchSound = document.getElementById("match-sound");
const failSound = document.getElementById("fail-sound");
const winSound = document.getElementById("win-sound");

function startGame() {
  board.innerHTML = "";
  message.textContent = "";
  flippedCards = [];
  lockBoard = false;
  tries = 0;
  cards = [...emojis, ...emojis].sort(() => 0.5 - Math.random());
  scoreDisplay.textContent = 0;
  timerDisplay.textContent = 0;
  startTime = Date.now();

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);

  cards.forEach((emoji, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.innerHTML = '';
    board.appendChild(card);

    card.addEventListener("click", () => {
      if (lockBoard || card.classList.contains("flipped")) return;

      card.classList.add("flipped");
      card.innerHTML = emoji;
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        lockBoard = true;
        tries++;
        scoreDisplay.textContent = tries;
        setTimeout(checkMatch, 700);
      }
    });
  });
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.emoji === card2.dataset.emoji) {
    matchSound.play();
    card1.style.backgroundColor = '#8bc34a';
    card2.style.backgroundColor = '#8bc34a';
  } else {
    failSound.play();
    card1.classList.remove("flipped");
    card2.classList.remove("flipped");
    card1.innerHTML = '';
    card2.innerHTML = '';
  }

  flippedCards = [];
  lockBoard = false;

  const allFlipped = document.querySelectorAll(".card.flipped").length;
  if (allFlipped === cards.length) {
    clearInterval(timerInterval);
    winSound.play();
    message.textContent = `🎉 لقد فزت في ${tries} محاولة خلال ${timerDisplay.textContent} ثانية!`;
  }
}

function updateTimer() {
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  timerDisplay.textContent = seconds;
}

function restartGame() {
  startGame();
}

startGame();
