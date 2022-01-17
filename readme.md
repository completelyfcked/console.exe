# console.exe
If you know how to horizontally center text in process.stdout, please send me a message <3
## Installation
[Linux](https://github.com/completelyfcked/console.exe/releases/latest/download/linux) - [MacOS](https://github.com/completelyfcked/console.exe/releases/latest/download/mac) - [Windows](https://github.com/completelyfcked/console.exe/releases/latest/download/win.exe)

## Security
### Why is it open source?
Since it's a executable a lot of things can happen behind the scenes, like:
- Cookie logger
- Password stealer
- IP logger
### Sites being accessed
- http://cnft.server.rubendb.nl/cmdauth
- https://console-nft.art/console-exe/code.php
### Modefied Dependencies
- []`quick.db`](https://www.npmjs.com/package/quick.db) src/index.js:7 'json.sqlite' --> 'console-exe.sqlite'

## Building
Only tested on NodeJS v16.*
### Steps
- Have [pkg](https://www.npmjs.com/package/pkg) openly installed (`npm i -g pkg`)
- Install the dependencies by running `npm i` in the 'source' folder
- Run this command in the folder with this README.md
`pkg source/package.json`
If you're having trouble, google it!
- Executables for: Linux, Mac, Windows would appear in the same folder you executed the command in