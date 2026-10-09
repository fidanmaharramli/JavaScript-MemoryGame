const cards = document.querySelectorAll('.block');

let hasFlippedCard = false; 
let lockBoard = false;      
let firstCard, secondCard;  
let matchedPairs = 0; 


cards.forEach(card => card.addEventListener('click', flipCard));

function flipCard() {
    if (lockBoard) return; 
    if (this === firstCard) return; 

    this.classList.add('open'); 

    if (!hasFlippedCard) {
        
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.card === secondCard.dataset.card;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    matchedPairs += 1; 

    if (matchedPairs === 8) { 
        setTimeout(() => {
            document.getElementById('win-modal').style.display = 'flex';
            alert("Поздравляем! Вы нашли все пары и победили! 🎉");
        }, 500); 
    }

    resetBoard();
}


function unflipCards() {
    lockBoard = true; 
    setTimeout(() => {
        firstCard.classList.remove('open');
        secondCard.classList.remove('open');
        resetBoard(); 
    }, 1000);
}


function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}



(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 16);
        card.style.order = randomPos;
    });
})();
