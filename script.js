const allLevels = [
  { cards: ['🍄', '🐞', '🍄', '🐞', '🦋', '🦋'], time: 30 },
  { cards: ['🍄', '🐞', '🦋', '🌿', '🍄', '🐞', '🦋', '🌿', '🐛', '🐛'], time: 45 },
  { cards: ['🍄','🍄','🐞','🐞','🦋','🦋','🌿','🌿','🐛','🐛','🐝','🐝','🐌','🐌','🪲','🪲'], time: 60 },
  { cards: ['🍄','🍄','🐞','🐞','🦋','🦋','🌿','🌿','🐛','🐛','🐝','🐝','🐌','🐌','🪲','🪲','🐜','🐜','🦗','🦗'], time: 90 },
  { cards: ['🍄','🍄','🐞','🐞','🦋','🦋','🌿','🌿','🐛','🐛','🐝','🐝','🐌','🐌','🪲','🪲','🐜','🐜','🦗','🦗','🕷','🕷','🦂','🦂','🪳','🪳'], time: 120 }
];

let currentLevel = parseInt(localStorage.getItem('level')) || 1;
let timeLeft = allLevels[currentLevel - 1].time;
let timerInterval;
let matchedPairs = 0;

const cardsArray = allLevels[currentLevel - 1].cards;
let shuffled = [...cardsArray].sort(() => 0.5 - Math.random());

let isPaused = false;
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');

const board = document.getElementById('gameBoard');
const timerDisplay = document.getElementById('timer');
const warning = document.getElementById('warning');
const congrats = document.getElementById('congrats');
const levelLabel = document.getElementById('level');
const flipSound = document.getElementById('flipSound');
const wrongSound = document.getElementById('wrongSound');
const soundToggle = document.getElementById('soundToggle');
const vibrationToggle = document.getElementById('vibrationToggle');
const settingsIcon = document.getElementById('settings-icon');
const settingsPanel = document.getElementById('settings-panel');

settingsIcon.addEventListener('click', () => {
  settingsPanel.classList.toggle('hidden');
});

pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? '▶️ Resume' : '⏸️ Pause';
});

restartBtn.addEventListener('click', () => {
  const confirmRestart = confirm('🔄 Are you sure you want to restart this level?');
  if (confirmRestart) {
    location.reload();
  }
});



levelLabel.textContent = `Level: ${currentLevel}`;

function createBoard() {
  board.innerHTML = '';
  shuffled.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.innerHTML = '';
    board.appendChild(card);
    card.addEventListener('click', () => flipCard(card));
  });
}

let firstCard = null;
let secondCard = null;
let lockBoard = false;

function flipCard(card) {
  if (lockBoard || card.classList.contains('flipped') || card === firstCard) return;

  if (isPaused || lockBoard || card.classList.contains('flipped') || card === firstCard) return;

  card.classList.add('flipped');
  card.innerHTML = card.dataset.emoji;
if (soundToggle.checked) flipSound.play();

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    lockBoard = true;

    setTimeout(() => {
      if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
        matchedPairs++;
        checkWin();
      } else {
        if (soundToggle.checked) wrongSound.play();
if (vibrationToggle.checked && navigator.vibrate) navigator.vibrate(200);

        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.innerHTML = '';
        secondCard.innerHTML = '';
      }
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 1000);
  }
}

function checkWin() {
  if (matchedPairs === cardsArray.length / 2) {
    clearInterval(timerInterval);
    congrats.classList.remove('hidden');

    // Level-up after delay
    setTimeout(() => {
      congrats.classList.add('hidden');
      nextLevel();
    }, 3000);
  }
}

function startTimer() {
  timerDisplay.textContent = `Time Left: ${timeLeft}s`;

  timerInterval = setInterval(() => {
    if (isPaused) return;

    timeLeft--;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;

    if (timeLeft <= 10) {
      warning.classList.remove('hidden');
      timerDisplay.style.color = 'red';
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert('⏰ Time is up! Restarting level...');
      location.reload();
    }
  }, 1000);
}


function nextLevel() {
  if (currentLevel < 5) {
    currentLevel++;
    localStorage.setItem('level', currentLevel);
    location.reload(); // load next level
  } else {
    alert('🏁 Game Complete! All levels cleared.');
    localStorage.removeItem('level'); // reset for future
    location.reload();
  }
}

createBoard();
startTimer();
