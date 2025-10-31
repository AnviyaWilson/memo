const allLevels = [
  { cards: ['🍄','🐞','🍄','🐞','🦋','🦋'], time: 15 },
  { cards: ['🍄','🐞','🦋','🌿','🍄','🐞','🦋','🌿','🐛','🐛'], time: 30 },
  { cards: ['🍄','🍄','🐞','🐞','🦋','🦋','🌿','🌿','🐛','🐛','🐝','🐝','🐌','🐌','🪲','🪲'], time: 60 },
  { cards: ['🍄','🍄','🐞','🐞','🦋','🦋','🌿','🌿','🐛','🐛','🐝','🐝','🐌','🐌','🪲','🪲','🐜','🐜','🦗','🦗'], time: 90 },
  { cards: ['🍄','🍄','🐞','🐞','🦋','🦋','🌿','🌿','🐛','🐛','🐝','🐝','🐌','🐌','🪲','🪲','🐜','🐜','🦗','🦗','🕷','🕷','🦂','🦂','🪳','🪳'], time: 120 }
];

document.addEventListener('DOMContentLoaded', () => {
  // state
  let currentLevel = Number(localStorage.getItem('level')) || 1;
  let timeLeft = allLevels[currentLevel - 1].time;
  let timerInterval = null;
  let isPaused = false;

  // DOM
  const board = document.getElementById('gameBoard');
  const timerDisplay = document.getElementById('timer');
  const warning = document.getElementById('warning');
  const levelLabel = document.getElementById('level');
  const pauseBtn = document.getElementById('pauseBtn');
  const restartBtn = document.getElementById('restartBtn');
  const leaveBtn = document.getElementById('leaveBtn');
  const settingsIcon = document.getElementById('settings-icon');
  const settingsPanel = document.getElementById('settings-panel');
  const vibrationToggle = document.getElementById('vibrationToggle');
  const blast = document.getElementById('blastAnimation');
  const congrats = document.getElementById('congrats');

  // flip state
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  let matchedPairs = 0;

  // helpers
  const shuffle = arr => arr.sort(() => Math.random() - 0.5);

  function updateTimerUI() {
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
  }

  function buildBoard() {
    // reset flags
    firstCard = null; secondCard = null; lockBoard = false; matchedPairs = 0;
    // set UI
    levelLabel.textContent = `Level: ${currentLevel}`;
    timeLeft = allLevels[currentLevel - 1].time;
    updateTimerUI();
    warning.classList.add('hidden');
    // clear board
    board.innerHTML = '';

    // create shuffled cards from level definition (cards already contain pairs)
    const cards = shuffle([...allLevels[currentLevel - 1].cards]);

    cards.forEach((emoji, idx) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.emoji = emoji;
      // inner faces
      card.innerHTML = `
        <div class="card-inner" aria-hidden="false">
          <div class="card-face card-front"></div>
          <div class="card-face card-back">${emoji}</div>
        </div>
      `;
      // add handlers
      card.addEventListener('click', () => handleFlip(card));
      card.addEventListener('touchstart', () => handleFlip(card), {passive:true});
      board.appendChild(card);
    });
  }

  function handleFlip(card) {
    if (lockBoard || isPaused) return;
    if (card === firstCard || card.classList.contains('matched')) return;

    card.classList.add('flipped');

    if (!firstCard) {
      firstCard = card;
      return;
    }

    secondCard = card;
    lockBoard = true;

    setTimeout(() => {
      const e1 = firstCard.dataset.emoji;
      const e2 = secondCard.dataset.emoji;
      if (e1 === e2) {
        // match
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matchedPairs++;
        // optional vibration
        if (vibrationToggle && vibrationToggle.checked && navigator.vibrate) navigator.vibrate(60);
        resetTurn();
        checkWin();
      } else {
        // not match: flip back
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetTurn();
      }
    }, 700);
  }

  function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
  }

  function checkWin() {
    const totalPairs = allLevels[currentLevel - 1].cards.length / 2;
    if (matchedPairs === totalPairs) {
      clearInterval(timerInterval);
      // animate blast and congrats
      if (blast) {
        blast.classList.remove('hidden'); blast.classList.add('show');
        setTimeout(()=>{ blast.classList.remove('show'); blast.classList.add('hidden'); }, 900);
      }
      congrats.classList.remove('hidden');
      setTimeout(()=> {
        congrats.classList.add('hidden');
        nextLevel();
      }, 1000);
    }
  }

  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (isPaused) return;
      timeLeft--;
      updateTimerUI();
      if (timeLeft <= 10) warning.classList.remove('hidden');
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        alert('⏰ Time is up! Restarting level...');
        buildBoard();
        startTimer();
      }
    }, 1000);
  }

  function nextLevel() {
    if (currentLevel < allLevels.length) {
      currentLevel++;
      localStorage.setItem('level', String(currentLevel));
    } else {
      // finished all levels -> restart from 1
      alert('🏁 You completed all levels! Restarting from Level 1.');
      currentLevel = 1;
      localStorage.removeItem('level');
    }
    buildBoard();
    startTimer();
  }

  // Buttons
  pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '▶️ Resume' : '⏸️ Pause';
  });

  restartBtn.addEventListener('click', () => {
    if (confirm('Restart current level?')) {
      buildBoard();
      startTimer();
    }
  });

  leaveBtn.addEventListener('click', () => {
    if (confirm('Leave game and return to Level 1?')) {
      currentLevel = 1;
      localStorage.removeItem('level');
      buildBoard();
      startTimer();
    }
  });

  settingsIcon?.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
  });

  // Initialize
  buildBoard();
  startTimer();

  // expose for debugging (optional)
  window._memoryGame = {
    buildBoard, startTimer, get currentLevel(){ return currentLevel; }
  };
});
createBoard();
startTimer();


