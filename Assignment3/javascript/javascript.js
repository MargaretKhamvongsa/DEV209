const symbols = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍍', '🥝', '🍒'];
const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
let cards = [];
let flippedCards = [];
let moves = 0;

// Initialize game
function initGame() {
  const doubledSymbols = [...symbols, ...symbols];
  shuffledCards = doubledSymbols.sort(() => Math.random() - 0.5);

  shuffledCards.forEach((symbol) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
    cards.push(card);
  });
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
    alert(`Game Over! You won in ${moves} moves.`);
  }
}

// Functional programming concept (map)
const shuffleCards = symbols => [...symbols, ...symbols].sort(() => Math.random() - 0.5);

// Start game
initGame();
