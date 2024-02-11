const baseURL = 'http://localhost:3000'

interface Card {
    number: number;
    shape: string;
    color: string;
    imageUrl: string;
}


window.onload = () => loadImagesFromBackend();

//1. Requests the deck's current state (and loads the cards' pictures into the container) -GET
export async function loadImagesFromBackend(): Promise<void> {
    const response: Response = await fetch(baseURL + '/api/getDeck', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const deck: Card[] = await response.json();

    const cardImagesContainer: HTMLElement | null = document.getElementById('cardImagesContainer');

    //clearScreen();

    // Append images to the container
    deck.forEach((card: Card) => {
        const img: HTMLImageElement = document.createElement('img');
        img.src = card.imageUrl;
        if (cardImagesContainer) {
            cardImagesContainer.appendChild(img);
        }
    });
}

//2. Requests and load the picture of a random number from the deck -GET
async function getRandomCard(): Promise<void> {
    const response = await fetch(baseURL + '/api/getRndCardFromDeck', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const randomCard = await response.json();

    clearScreen();

    const cardImagesContainer = document.getElementById('cardImagesContainer');

    if (cardImagesContainer instanceof HTMLElement) {
        const img = document.createElement('img');
        img.src = randomCard.imageUrl;
        cardImagesContainer.appendChild(img);
    }
}

//3. Requests the addCard function from the backend -POST
async function addCard(): Promise<void> {
    const number = (document.getElementById('newCardNumber') as HTMLInputElement).value;
    const shape = (document.getElementById('newCardShape') as HTMLInputElement).value;
    const imageUrl = "";
    let color = "black";

    if (shape === "diamonds" || shape === "hearts") {
        color = "red";
    }

    const newCard = {
        number,
        shape,
        color,
        imageUrl
    };

    const response = await fetch(baseURL + '/api/addCard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCard), // sends the STRING form of new card to the backend
    });

    const result = await response.json();
    alert(result.message);

    showAddCardForm(false);
}

//4. Calls the deleteCard function from the backend -DELETE
async function deleteCard(): Promise<void> {
    const number = (document.getElementById('deleteCardNumber') as HTMLInputElement).value;
    const shape = (document.getElementById('deleteCardShape') as HTMLInputElement).value;

    const response = await fetch(baseURL + '/api/deleteCard', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ number, shape })
    });

    const result = await response.json();
    alert(result.message);
    await loadImagesFromBackend();
}

//5. Requests the shuffleDeck fucmtion from the backend and loads the deck -PATCH
async function shuffleDeck(): Promise<void> {
    const response = await fetch(baseURL + '/api/shuffleDeck', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const deck = await response.json();

    await loadImagesFromBackend();
}



//Forms functions
function showAddCardForm(show: boolean): void {
    const addCardForm = document.getElementById('addCardForm');
    if (addCardForm) {
        if (show) {
            showDeleteCardForm(false);
            addCardForm.style.display = 'block'; //visible
        } else {
            addCardForm.style.display = 'none'; //!visible
        }
    }
}

function showDeleteCardForm(show: boolean): void {
    const cardImagesContainer = document.getElementById('cardImagesContainer'); //only once is fine since the forms' functions call each other
    if (cardImagesContainer) {
        cardImagesContainer.innerHTML = '';

        const deleteCardForm = document.getElementById('deleteCardForm');
        if (deleteCardForm) {
            if (show) {
                showAddCardForm(false);
                deleteCardForm.style.display = 'block'; //visible
            } else {
                deleteCardForm.style.display = 'none'; //!visible
            }
        }
    }
}


function clearScreen(): void {
    const cardImagesContainer = document.getElementById('cardImagesContainer');
    if (cardImagesContainer) {
        cardImagesContainer.innerHTML = ''; //Empties the container which makes it invisible
        showAddCardForm(false);
        showDeleteCardForm(false);
    }
}
