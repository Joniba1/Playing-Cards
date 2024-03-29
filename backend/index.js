const express = require('express');
const path = require('path');
const fs = require('fs');

/*I need the default state of the deck, not the current, in order to always
 have access to the cards' urls even if a card was deleted (for the add card function)
 and for resetting the deck each time the server reopens*/
const defaultDeck = require('./base_deck.js').getDeck();

const app = express();
const port = 3000;
const base_URL = 'http://localhost:'

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend'))); //serves as a 'middleperson', makes the server accessible to clients

//Reads and returns the json file
const readJsonFile = () => {
  const jsonData = fs.readFileSync('dynamic_deck.json', 'utf-8');
  return JSON.parse(jsonData);
}

//updates the json file
const updateJsonFile = (deck) => {
  const jsonString = JSON.stringify(deck, null, 2);
  fs.writeFileSync('dynamic_deck.json', jsonString);
};

//The REST API functions:
//GET.1 - Returns all the cards in the deck
app.get('/api/getDeck', (req, res) => {
  const deck = readJsonFile();
  res.json(deck);
});

//GET.2 - Returns a random CARD from the deck
app.get('/api/getRndCardFromDeck', (req, res) => {
  const deck = readJsonFile();

  if (deck.length == 0) {
    return res.status(404).json({ error: 'Deck is empty' });
  }

  const rnd = Math.floor(Math.random() * deck.length);

  const randomCard = deck[rnd];

  res.json(randomCard);
});

//POST - Adds a card
app.post('/api/addCard', (req, res) => {
  const newCard = req.body;

  newCard.number = parseInt(newCard.number);

  newCard.imageUrl = defaultDeck.find(card => card.number === newCard.number && card.shape === newCard.shape).imageUrl;

  let deck = readJsonFile();
  deck.push(newCard);
  updateJsonFile(deck);

  res.json({ message: 'Card added successfully' });
});

//DELETE - Deletes a card from the deck
app.delete('/api/deleteCard', (req, res) => {
  let { number, shape } = req.body;

  number = parseInt(number);

  let deck = readJsonFile();

  const index = deck.findIndex(card => card.number === number && card.shape === shape);

  //deletes just one instance of the card even if there are multiple cases
  if (index !== -1) {
    deck.splice(index, 1);
    updateJsonFile(deck);
    res.json({ message: 'Card deleted successfully' });
  }
  else {
    res.json({ message: 'Card was not found' });
  }

});

//PATCH - Shuffles the deck
app.patch('/api/shuffleDeck', (req, res) => {
  let deck = readJsonFile();

  for (let i = deck.length - 1; i > 0; i--) {
    const rnd = Math.floor(Math.random() * (i + 1));
    const card = deck[i];
    deck[i] = deck[rnd];
    deck[rnd] = card;
  }

  updateJsonFile(deck);

  res.json(deck);

});


//Starts the server and listens to incoming requests from the HTML file
app.listen(port, () => {
  //updateJsonFile(defaultDeck);
  console.log(`Server is running at ${base_URL}${port}`);
});
