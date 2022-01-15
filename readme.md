# Console NFT Executable

## Why is it open source?
Since it's a executable a lot of things can happen behind the scenes, like:
- Cookie logger
- Password stealer
- IP logger
We don't like them too!
We have made all requests to the outside obvious
### Lines that access the web (source/index.js)
- 62
- 101
### Sites being accessed
- https://cnft.server.rubendb.nl

## Building
- Only tested on Node v16
### Steps
- Have "pkg" openly installed (`npm i -g pkg`)
- Run this command in the folder with this README.md
`pkg source/package.json`
If you're having trouble, google it!
- Executables for: Linux, Mac, Windows would appear in the "build" folder