const animals = ["🐘", "🦁", "🐸", "🦊", "🐧", "🦋", "🐬", "🦜", "🐢", "🦒"];

const welcomeScreen = document.getElementById("welcome-screen");
const gameScreen = document.getElementById("game-screen");
const finalScreen = document.getElementById("final-screen");

const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const board = document.getElementById("board");
const moveCounter = document.getElementById("move-counter");
const finalTitle = document.getElementById("final-title");
const finalMessage = document.getElementById("final-message");

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
const totalPairs = animals.length;

function showScreen(screen) {
  welcomeScreen.classList.remove("active");
  gameScreen.classList.remove("active");
  finalScreen.classList.remove("active");
  screen.classList.add("active");
}

function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function createCard(emoji, index) {
  const card = document.createElement("button");
  card.className = "card";
  card.type = "button";
  card.dataset.animal = emoji;
  card.dataset.index = String(index);

  card.innerHTML = `
    <span class="card-inner">
      <span class="card-face card-back">🌿</span>
      <span class="card-face card-front">${emoji}</span>
    </span>
  `;

  card.addEventListener("click", () => handleCardClick(card));
  return card;
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function updateMoves() {
  moveCounter.textContent = String(moves);
}

function finishGame() {
  finalTitle.textContent = "¡Ganaste!";
  finalMessage.textContent = `Completaste el juego en ${moves} movimientos.`;
  showScreen(finalScreen);
}

function checkForMatch() {
  if (!firstCard || !secondCard) {
    return;
  }

  const isMatch = firstCard.dataset.animal === secondCard.dataset.animal;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard.disabled = true;
    secondCard.disabled = true;
    matchedPairs += 1;
    resetTurn();

    if (matchedPairs === totalPairs) {
      finishGame();
    }
    return;
  }

  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetTurn();
}

function handleCardClick(card) {
  if (lockBoard || card === firstCard || card.classList.contains("matched")) {
    return;
  }

  card.classList.add("flipped");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;
  moves += 1;
  updateMoves();
  checkForMatch();
}

function buildBoard() {
  board.innerHTML = "";
  const deck = shuffle([...animals, ...animals]);

  deck.forEach((emoji, index) => {
    board.appendChild(createCard(emoji, index));
  });
}

function startGame() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  matchedPairs = 0;
  updateMoves();
  buildBoard();
  showScreen(gameScreen);
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
