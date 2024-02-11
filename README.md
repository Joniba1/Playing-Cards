### Pre-Requirements:
[Node.js](https://nodejs.org/en)

Type to the terminal to install Express: npm install express

---

### Notes
* I used Node.js with Express for this project.
* base_deck.js contains the default hard-coded (because there's a unique URL for each card) state of the deck as a singleton list. I use it to reset the JSON file list each time regardless of any modifications the client did.
* dynamic_deck.json is the JSON file with the modifiable deck of cards. The client can modify it with shuffle and add/delete cards.
* The color attribute is useless right now, but might not be in the future so I kept it.