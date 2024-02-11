I used Node.js with Express for this project.

deck.js contains the default hard-coded (because there's a unique URL for each card) state of the deck as a singelton array. I use it to reset the JSON file list each time regardless of any modifications the client did.

deck.json is the JSON file with the modifiable deck of cards. The client can modify it with shuffle and add/delete cards.

The color attribute is useless right now, but might not be in the future so I kept it.