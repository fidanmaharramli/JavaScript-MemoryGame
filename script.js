const cards = document.querySelectorAll('.block');
const winModal = document.getElementById('win-modal');
const restartBtn = document.getElementById('restart-btn');
const resetHeaderBtn = document.getElementById('reset-game-btn');
const movesDisplay = document.getElementById('moves-count');
const timerDisplay = document.getElementById('timer');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;

let moves = 0;
let timer = null;
let seconds = 0;
let gameStarted = false;


const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(freq, type = 'sine', duration = 0.15) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}


function startTimer() {
    if (gameStarted) return;
    gameStarted = true;
    timer = setInterval(() => {
        seconds++;
        const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        timerDisplay.textContent = `${mins}:${secs}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

cards.forEach(card => card.addEventListener('click', flipCard));

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    startTimer();
    playSound(400); // Звук клика

    this.classList.add('open');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    moves++;
    movesDisplay.textContent = moves;

    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.card === secondCard.dataset.card;
    if (isMatch) {
        playSound(600, 'triangle', 0.2); // Звук угаданной пары
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matchedPairs += 1;

    if (matchedPairs === 8) {
        stopTimer();
        setTimeout(showWinModal, 600);
    }

    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        playSound(200, 'sawtooth', 0.15); // Звук ошибки
        firstCard.classList.remove('open');
        secondCard.classList.remove('open');
        resetBoard();
    }, 900);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 16);
        card.style.order = randomPos;
    });
}

function showWinModal() {
    playSound(800, 'sine', 0.4); // Победный аккорд
    
    document.getElementById('final-time').textContent = timerDisplay.textContent;
    document.getElementById('final-moves').textContent = moves;

    const starsDisplay = document.getElementById('final-stars');
    if (moves <= 10) {
        starsDisplay.textContent = '⭐⭐⭐';
    } else if (moves <= 15) {
        starsDisplay.textContent = '⭐⭐';
    } else {
        starsDisplay.textContent = '⭐';
    }

    winModal.style.display = 'flex';
}


function initGame() {
    winModal.style.display = 'none';
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    gameStarted = false;
    stopTimer();
    
    movesDisplay.textContent = '0';
    timerDisplay.textContent = '00:00';

    cards.forEach(card => {
        card.classList.remove('open');
        card.addEventListener('click', flipCard);
    });

    setTimeout(shuffle, 300);
}

restartBtn.addEventListener('click', initGame);
resetHeaderBtn.addEventListener('click', initGame);

// Старт игры
shuffle();
