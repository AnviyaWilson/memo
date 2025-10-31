const gameBoard = document.getElementById("gameBoard");
const timerDisplay = document.getElementById("timer");
const warning = document.getElementById("warning");
const levelDisplay = document.getElementById("level");
const congrats = document.getElementById("congrats");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");
const leaveBtn = document.getElementById("leaveBtn");

let level = 1;
let timeLeft = 15;
let timer;
let paused = false;
let flippedCards = [];
let matchedCount = 0;

const levelCards = {
  1: 10,
  2: 16,
  3: 20,
  4: 24,
  5: 28
};

const emojis = ["🍎","🍌","🍇","🍉","🍓","🍒","🍍","🥝","🥑","🍑","🍋","🍊",
                "🍅","🥥","🥕","🌽","🍄","🌶️","🥔","🧄","🥦","🍔","🍟","🍕","🌭","🍿","🧁","🍩","🍪","🍫","🍬"];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startLevel(lvl) {
  gameBoard.className = `game-board level-${lvl}`;
  gameBoard.innerHTML = "";
  const numCards = levelCards[lvl];
  const chosen = shuffle(emojis.slice(0, numCards / 2));
  const cardsArray = shuffle([...chosen, ...chosen]);

  cardsArray.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;
    card.innerHTML = "";
    card.addEventListener("click", handleFlip, { passive: true });
    gameBoard.appendChild(card);
  });

  matchedCount = 0;
  flippedCards = [];
  const levelTimes = { 1: 30, 2: 45, 3: 55, 4: 65, 5: 70 };
  timeLeft = levelTimes[lvl];
  updateTimerDisplay();
  startTimer();
}

function handleFlip(e) {
  if (paused) return;
  const card = e.currentTarget;
  if (card.classList.contains("flipped") || flippedCards.length === 2) return;

  card.classList.add("flipped");
  card.innerHTML = card.dataset.symbol;
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    setTimeout(checkMatch, 600);
  }
}

function checkMatch() {
  const [a, b] = flippedCards;
  if (a.dataset.symbol === b.dataset.symbol) {
    matchedCount += 2;
    flippedCards = [];
    if (matchedCount === levelCards[level]) {
      levelComplete();
    }
  } else {
    setTimeout(() => {
      a.classList.remove("flipped");
      b.classList.remove("flipped");
      a.innerHTML = "";
      b.innerHTML = "";
      flippedCards = [];
    }, 800);
  }
}

function levelComplete() {
  clearInterval(timer);
  congrats.classList.remove("hidden");
  setTimeout(() => congrats.classList.add("hidden"), 2000);
  if (level < 5) {
    setTimeout(() => startLevel(++level), 2500);
    levelDisplay.textContent = `Level: ${level}`;
  } else {
    alert("🎉 You finished all levels!");
    resetToLevel1();
  }
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (!paused) {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) {
        clearInterval(timer);
        alert("⏰ Time’s up! Restarting level.");
        startLevel(level);
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  timerDisplay.textContent = `Time Left: ${timeLeft}s`;
  warning.classList.toggle("hidden", timeLeft > 10);
}

pauseBtn.onclick = () => {
  paused = !paused;
  pauseBtn.textContent = paused ? "▶️ Resume" : "⏸️ Pause";
};

restartBtn.onclick = () => {
  startLevel(level);
};

leaveBtn.onclick = () => {
  resetToLevel1();
};

function resetToLevel1() {
  clearInterval(timer);
  level = 1;
  levelDisplay.textContent = `Level: ${level}`;
  startLevel(level);
}

startLevel(level);

startTimer();



