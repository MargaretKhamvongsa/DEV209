
const symbols = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍍', '🥝', '🍒'];
const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const difficultySelector = document.getElementById('difficulty');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
let cards = [];
let flippedCards = [];
let moves = 0;
let timer = 0;
let timerInterval;

// Initialize game
function initGame(rows = 4, cols = 4) {
  resetGame();

  const doubledSymbols = [...symbols, ...symbols].slice(0, rows * cols / 2);
  const shuffledCards = doubledSymbols.concat(doubledSymbols).sort(() => Math.random() - 0.5);

  shuffledCards.forEach((symbol) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
    cards.push(card);
  });

  gameBoard.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
}

// Reset game state
function resetGame() {
  clearInterval(timerInterval);
  timer = 0;
  moves = 0;
  flippedCards = [];
  cards = [];
  gameBoard.innerHTML = '';
  timerDisplay.textContent = `Time: 0s`;
  movesDisplay.textContent = `Moves: 0`;
}

// Start timer
function startTimer() {
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = `Time: ${timer}s`;
  }, 1000);
}

// Stop game
function stopGame() {
  resetGame();
  alert('Game stopped.');
}

// Flip card
function flipCard() {
  if (flippedCards.length === 2 || this.classList.contains('flipped')) return;

  this.classList.add('flipped');
  this.textContent = this.dataset.symbol;
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

// Check for a match
function checkMatch() {
  moves++;
  movesDisplay.textContent = `Moves: ${moves}`;

  const [card1, card2] = flippedCards;
  if (card1.dataset.symbol === card2.dataset.symbol) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    flippedCards = [];
    checkGameOver();
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      card1.textContent = '';
      card2.textContent = '';
      flippedCards = [];
    }, 1000);
  }
}

// Check if game is over
function checkGameOver() {
  if (cards.every((card) => card.classList.contains('matched'))) {
    clearInterval(timerInterval);
    alert(`Game Over! You won in ${moves} moves and ${timer} seconds.`);
  }
}

// Event listener for start button
startButton.addEventListener('click', () => {
  const difficulty = difficultySelector.value;
  let rows, cols;
  if (difficulty === 'easy') {
    rows = 3; cols = 4;
  } else if (difficulty === 'medium') {
    rows = 4; cols = 4;
  } else {
    rows = 6; cols = 6;
  }
  initGame(rows, cols);
  startTimer();
});

// Event listener for stop button
stopButton.addEventListener('click', stopGame);
