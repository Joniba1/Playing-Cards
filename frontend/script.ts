const baseURL = 'http://localhost:3000'

window.onload = loadImagesFromBackend();

//1. Requests the deck's current state (and loads the cards' pictures into the container) -GET
async function loadImagesFromBackend() {
    const response = await fetch(baseURL + '/api/getDeck', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const deck = await response.json();

    const cardImagesContainer = document.getElementById('cardImagesContainer');

    clearScreen();

    //append  images to the container
    deck.forEach(card => {
        const img = document.createElement('img');
        img.src = card.imageUrl;
        cardImagesContainer.appendChild(img);
    });
}

//2. Requests and load the picture of a random number from the deck -GET
async function getRandomCard() {
    const response = await fetch(baseURL + '/api/getRndCardFromDeck', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const randomCard = await response.json();

    clearScreen();

    const cardImagesContainer = document.getElementById('cardImagesContainer');

    const img = document.createElement('img');
    img.src = randomCard.imageUrl;
    cardImagesContainer.appendChild(img);
}

//3. Requests the addCard function from the backend -POST
async function addCard() {

    const number = document.getElementById('newCardNumber').value;
    const shape = document.getElementById('newCardShape').value;
    const imageUrl = "";
    let color = "black";

    if (shape === "diamonds" || shape === "hearts") {
        color = "red"
    }

    const newCard = {
        number, shape, color, imageUrl
    };

    const response = await fetch(baseURL + '/api/addCard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCard), //sends the STRING form of new card to the backend
    });

    const result = await response.json();
    alert(result.message);

    showAddCardForm(false);
}

//4. Calls the deleteCard function from the backend -DELETE
async function deleteCard() {
    const number = document.getElementById('deleteCardNumber').value;
    const shape = document.getElementById('deleteCardShape').value;

    const response = await fetch(baseURL + '/api/deleteCard', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ number, shape })
    });

    const result = await response.json();
    alert(result.message);
    loadImagesFromBackend();
}

//5. Requests the shuffleDeck fucmtion from the backend and loads the deck -PATCH
async function shuffleDeck() {

    const response = await fetch(baseURL + '/api/shuffleDeck', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const deck = await response.json();

    loadImagesFromBackend();
}


//Forms functions
function showAddCardForm(boolean) {
    if (boolean == true) {
        showDeleteCardForm(false);
        document.getElementById('addCardForm').style.display = 'block'; //visible
    }
    else {
        document.getElementById('addCardForm').style.display = 'none'; //!visible
    }
}

function showDeleteCardForm(boolean) {
    const cardImagesContainer = document.getElementById('cardImagesContainer'); //only once is fine since the forms' functions call each other
    cardImagesContainer.innerHTML = '';

    if (boolean == true) {
        showAddCardForm(false);
        document.getElementById('deleteCardForm').style.display = 'block'; //visible
    }
    else {
        document.getElementById('deleteCardForm').style.display = 'none'; //!visible
    }
}


//Clears the screen
function clearScreen() {
    const cardImagesContainer = document.getElementById('cardImagesContainer');
    cardImagesContainer.innerHTML = ''; //Empties the container which makes it invisible
    showAddCardForm(false);
    showDeleteCardForm(false);
}