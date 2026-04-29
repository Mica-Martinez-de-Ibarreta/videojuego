const animals = ["🐘", "🦁", "🐸", "🦊", "🐧", "🦋", "🐬", "🦜", "🐢", "🦒"];

const welcomeScreen = document.getElementById("welcome-screen");
const gameScreen = document.getElementById("game-screen");
const finalScreen = document.getElementById("final-screen");

const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");
const homeButton = document.getElementById("home-button");
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
const MAX_MOVES = 22;

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

  // Ponemos el contador en rojo cuando quedan 3 o menos movimientos
  const movesEl = document.getElementById("move-counter");
  const remaining = MAX_MOVES - moves;
  if (remaining <= 3) {
    movesEl.style.color = "#ef4444";
  } else {
    movesEl.style.color = "";
  }
}

function loseGame() {
  finalTitle.textContent = "¡Se acabaron los intentos! 🌿";
  finalTitle.style.color = "#ef4444";
  finalMessage.textContent = `Usaste los ${MAX_MOVES} movimientos sin encontrar todos los pares. ¡Intentalo de nuevo!`;
  showScreen(finalScreen);
}

function finishGame() {
  finalTitle.textContent = "¡Ganaste! 🎉";
  finalTitle.style.color = "";

  let msg = `Encontraste todos los pares en ${moves} movimientos.`;
  if (moves <= 12) {
    msg += " ¡Memoria extraordinaria! 🏆";
  } else if (moves <= 18) {
    msg += " ¡Muy bien! 🌟";
  } else {
    msg += " ¡Lo lograste! 🌿";
  }

  finalMessage.textContent = msg;
  showScreen(finalScreen);
}

function checkForMatch() {
  if (!firstCard || !secondCard) return;

  const isMatch = firstCard.dataset.animal === secondCard.dataset.animal;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard.disabled = true;
    secondCard.disabled = true;
    matchedPairs += 1;
    resetTurn();

    if (matchedPairs === totalPairs) {
      setTimeout(() => finishGame(), 400);
    }
    return;
  }

  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetTurn();

    // Verificamos derrota después de voltear las cartas de vuelta
    if (moves >= MAX_MOVES && matchedPairs < totalPairs) {
      setTimeout(() => loseGame(), 300);
    }
  }, 1000);
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

function goToWelcome() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  moves = 0;
  matchedPairs = 0;
  updateMoves();
  board.innerHTML = "";
  showScreen(welcomeScreen);
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
homeButton.addEventListener("click", goToWelcome);