import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
interface Card {
  number: number;
  shape: string;
  color: string;
  imageUrl: string;
}



/*I need the default state of the deck, not the current, in order to always
 have access to the cards' urls even if a card was deleted (for the add card function)
 and for resetting the deck each time the server reopens*/
const defaultDeck = require('./base_deck.ts').getDeck();

const app = express();
const port = 3000;
const base_URL = 'http://localhost:'

app.use(express.static(path.join(__dirname, '..', 'frontend'), {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.ts')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  },
}));


//Reads and returns the json file
const readJsonFile = (): Card[] => {
  const jsonData: string = fs.readFileSync('dynamic_deck.json', 'utf-8');
  return JSON.parse(jsonData) as Card[];
};

//updates the json file
const updateJsonFile = (deck: Card[]): void => {
  const jsonString: string = JSON.stringify(deck, null, 2);
  fs.writeFileSync('dynamic_deck.json', jsonString);
};

//The REST API functions:
//GET.1 - Returns all the cards in the deck
app.get('/api/getDeck', (req: Request, res: Response) => {
  const deck: Card[] = readJsonFile();
  res.json(deck);
});

//GET.2 - Returns a random CARD from the deck
app.get('/api/getRndCardFromDeck', (req: Request, res: Response) => {
  const deck = readJsonFile();

  if (deck.length === 0) {
    return res.status(404).json({ error: 'Deck is empty' });
  }

  const rnd: number = Math.floor(Math.random() * deck.length);

  const randomCard: Card = deck[rnd];

  res.json(randomCard);
});

//POST - Adds a card
app.post('/api/addCard', (req: Request, res: Response) => {
  const newCard: Card = req.body as Card;

  //parseInt

  newCard.imageUrl = defaultDeck.find((card: Card) => card.number === newCard.number && card.shape === newCard.shape)?.imageUrl;

  let deck: Card[] = readJsonFile();
  deck.push(newCard);
  updateJsonFile(deck);

  res.json({ message: 'Card added successfully' });
})

//DELETE - Deletes a card from the deck
app.delete('/api/deleteCard', (req: Request, res: Response) => {
  let { number, shape } = req.body;

  number = parseInt(number);

  let deck: Card[] = readJsonFile();

  const index: number = deck.findIndex((card: Card) => card.number === number && card.shape === shape);

  // Deletes just one instance of the card even if there are multiple cases
  if (index !== -1) {
    deck.splice(index, 1);
    updateJsonFile(deck);
    res.json({ message: 'Card deleted successfully' });
  } else {
    res.json({ message: 'Card was not found' });
  }
});


//PATCH - Shuffles the deck
app.patch('/api/shuffleDeck', (req: Request, res: Response) => {
  let deck: Card[] = readJsonFile();
  for (let i: number = 0; i < deck.length; i++) {
    const rnd: number = Math.floor(Math.random() * (i + 1));
    const card: Card = deck[i];
    deck[i] = deck[rnd];
    deck[rnd] = card;
  }

  updateJsonFile(deck);

  res.json(deck);
});


//Starts the server and listens to incoming requests from the HTML file
app.listen(port, () => {
  console.log(`Server is listening at ${base_URL}${port}`);
});