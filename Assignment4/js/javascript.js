const symbols = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍍', '🥝', '🍒'];
const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const difficultySelector = document.getElementById('difficulty');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
let cards = [];
let flippedCards = [];
let moves = sessionStorage.getItem('moves') ? parseInt(sessionStorage.getItem('moves')) : 0;
let timer = sessionStorage.getItem('timer') ? parseInt(sessionStorage.getItem('timer')) : 0;
let timerInterval;
let totalMoves = localStorage.getItem('totalMoves') ? parseInt(localStorage.getItem('totalMoves')) : 0;

// Load game state from sessionStorage (including layout)
function loadGameState() {
    const storedBoard = JSON.parse(sessionStorage.getItem('gameBoard'));
    const savedLayout = sessionStorage.getItem('gridColumns');

    if (savedLayout) {
        gameBoard.style.gridTemplateColumns = savedLayout;
    }

    if (storedBoard) {
        gameBoard.innerHTML = '';
        storedBoard.forEach(cardData => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.symbol = cardData.symbol;
            if (cardData.flipped) card.classList.add('flipped');
            if (cardData.matched) card.classList.add('matched');
            card.textContent = cardData.flipped ? cardData.symbol : '';
            card.style.backgroundColor = cardData.backgroundColor || ''; // Restore background
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
            cards.push(card);
        });

        timerDisplay.textContent = `Time: ${timer}s`;
        movesDisplay.textContent = `Moves: ${moves}`;
        startTimer();
    }
}

// Save game state to sessionStorage (including layout)
function saveGameState() {
    const gameState = cards.map(card => ({
        symbol: card.dataset.symbol,
        flipped: card.classList.contains('flipped'),
        matched: card.classList.contains('matched'),
        backgroundColor: card.style.backgroundColor // Store background color
    }));
    sessionStorage.setItem('gameBoard', JSON.stringify(gameState));
    sessionStorage.setItem('moves', moves);
    sessionStorage.setItem('timer', timer);
    sessionStorage.setItem('gridColumns', gameBoard.style.gridTemplateColumns); // Save layout
}

// Initialize game
function initGame(rows = 4, cols = 4) {
    resetGame();
    const doubledSymbols = [...symbols, ...symbols].slice(0, rows * cols / 2);
    const shuffledCards = doubledSymbols.concat(doubledSymbols).sort(() => Math.random() - 0.5);

    shuffledCards.forEach(symbol => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
        cards.push(card);
    });

    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
    saveGameState();
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
    sessionStorage.clear();
}

// Start timer
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = `Time: ${timer}s`;
        sessionStorage.setItem('timer', timer);
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
    this.style.backgroundColor = "#fff"; // Apply background change
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkMatch();
    }
    saveGameState();
}

// Check for a match
function checkMatch() {
    moves++;
    movesDisplay.textContent = `Moves: ${moves}`;
    sessionStorage.setItem('moves', moves);

    totalMoves++;
    localStorage.setItem('totalMoves', totalMoves);

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
            card1.style.backgroundColor = ''; // Reset background
            card2.style.backgroundColor = '';
            flippedCards = [];
            saveGameState();
        }, 1000);
    }
}

// Check if game is over
function checkGameOver() {
    if (cards.every(card => card.classList.contains('matched'))) {
        clearInterval(timerInterval);
        alert(`Game Over! You won in ${moves} moves and ${timer} seconds.`);
        sessionStorage.clear();
    }
}

// Sync moves across tabs
window.addEventListener("storage", (event) => {
    if (event.key === "totalMoves") {
        totalMoves = parseInt(event.newValue);
    }
});

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

// Load previous game state on page refresh
document.addEventListener("DOMContentLoaded", loadGameState);

// Event listener for stop button
stopButton.addEventListener('click', stopGame);
