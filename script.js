const cardsArray = ['🐞', '🍄', '🐝', '🐛', '🦋', '🌿', '🐞', '🍄', '🐝', '🐛', '🦋', '🌿'];
let shuffledCards = cardsArray.sort(() => 0.5 - Math.random());

const board = document.getElementById('gameBoard');
const congrats = document.getElementById('congrats');

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
const totalPairs = cardsArray.length / 2;

// Create cards
shuffledCards.forEach((icon, index) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.dataset.icon = icon;
  card.dataset.index = index;
  card.innerHTML = '';
  board.appendChild(card);

  card.addEventListener('click', () => flipCard(card));
});

function flipCard(card) {
  if (lockBoard || card.classList.contains('flipped') || card === firstCard) return;

  card.classList.add('flipped');
  card.innerHTML = card.dataset.icon;

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    lockBoard = true;

    setTimeout(() => {
      if (firstCard.dataset.icon === secondCard.dataset.icon) {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        matchedPairs++;
        checkWin();
      } else {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.innerHTML = '';
        secondCard.innerHTML = '';
      }

      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 2000); // 2 seconds
  }
}

function checkWin() {
  if (matchedPairs === totalPairs) {
    congrats.classList.remove('hidden');
  }
}
