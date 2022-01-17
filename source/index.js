const axios = require("axios").default // Requests
var term = require("terminal-kit").terminal // Console Markup & More
const parser = require("./responseParse") // Filter & Markup
const db = require("quick.db")

process.title = "Console.exe"
var sessionStorage = {}
module.exports.sessionStorage = sessionStorage;

const debug = (string) => { if (sessionStorage.debug) { term.brightCyan("DEBUG: ").white(string + "\n"); } }

term.on('key', function (name, matches, data) {
    if (name === 'CTRL_C') { term.processExit(); }
});

function loginPrompt() {
    console.clear()

    if (db.get('cache.id')) {
        term.brightGreen("Found cached id")

        axios.get("http://cnft.server.rubendb.nl/cmdauth", { params: { 'id': db.get('cache.id') } }).then((response) => {
            if (response.status != 200) {
                term.brightRed("\nConnection to authentication server failed\n")
                term.gray(`Status Code: ${response.status}\nStatus Message: ${response.statusText}`)
                term.processExit()
            } else {
                if (!response.data.toString().startsWith('true')) {
                    term.brightRed("\nFailed to authenticate\n\n")
                    term.brightWhite("Contact "); term.bold.colorRgb(248, 23, 0, "completelyfcked"); term.brightWhite(' to resolve/report this issue.')
                } else {
                    term.brightGreen("\nAuthenticated")

                    sessionStorage.id = db.get('cache.id')
                    sessionStorage.username = response.data.toString().split(":")[1]

                    home()
                }
            }
        }).catch(err => {
            term.brightRed("\nCould not connect to authentication server\n")
            return console.error(err)
        })
    } else {
        term.grey("Learn on how to get your Discord Id at https://www.remote.tools/remote-work/how-to-find-discord-id\n")
        term.brightRed("Please state your Discord Id: ")
        term.gray("(CTRL + C to cancel)\n")
        term.inputField(
            {
                //style: term.brightWhite,
                maxLength: 18,
                minLength: 2,
                default: ""
            }, function (err, string) {
                if (err) {
                    return term.brightRed("\nError when user input")
                }

                term.brightYellow("\n\nConnecting to authentication server")

                axios.get("http://cnft.server.rubendb.nl/cmdauth", { params: { 'id': string } }).then((response) => {
                    if (response.status != 200) {
                        term.brightRed("\nConnection to authentication server failed\n")
                        term.gray(`Status Code: ${response.status}\nStatus Message: ${response.statusText}`)
                        term.processExit()
                    } else {
                        if (!response.data.toString().startsWith('true')) {
                            term.brightRed("\nFailed to authenticate\n\n")
                            term.brightWhite("Contact "); term.bold.colorRgb(248, 23, 0, "completelyfcked"); term.brightWhite(' to resolve/report this issue.')
                        } else {
                            term.brightGreen("\nAuthenticated")

                            db.set('cache.id', string)
                            sessionStorage.id = string
                            sessionStorage.username = response.data.toString().split(":")[1]

                            home()
                        }
                    }
                }).catch(err => {
                    term.brightRed("\nCould not connect to authentication server\n")
                    return console.error(err)
                })
            }
        )
    }
}; loginPrompt()

function commandServerPing(script, res, noAwait) {
    debug('commandServerPing()')

    axios.get("https://console-nft.art/console-exe/code.php?data=exe-ping").then((ping) => {
        switch (ping.data.toString().split("*.SPLIT.*").join("")) {
            case 'true':
                term.brightGreen("\nServer is online\n")
                term.gray("Created by "); term.bold.colorRgb(248, 23, 0, "completelyfcked\n");
                firstCommand(script, res, noAwait)
                break;
            default:
                term.brightRed("\nServer fault\n")
                break;
        }
    }).catch(err => {
        term.brightRed("\nFailed to reach server ")
        term.gray("(connection issues?)\n")
    })
}

/**
 * @param {String} script 
 * @param {String} res
 */
async function home(script, res, noAwait) {
    debug('home()')
    console.clear()

    var trail = ".\n" // After "Goodmorning, ", "Good afternoon, ", "Good evening, "
    var msgColor = term.brightWhite; var nameColor = term.brightCyan;
    var date = new Date().getHours(); var welcomeMessage = "";
    if (date < 12) {
        welcomeMessage = "Goodmorning, "
    } else if (date < 18) {
        welcomeMessage = "Good afternoon, "
    } else {
        welcomeMessage = "Good evening, "
    }; msgColor(welcomeMessage); nameColor(sessionStorage.username); msgColor(trail)

    // Check if server is online
    commandServerPing(script, res, noAwait)
}; module.exports.home = home;

function firstCommand(script, res, noAwait) {
    debug('firstcommand()')
    term.defaultColor('Type your command(s) below\n\n')
    
    if (script) {
        term.brightWhite("> ").defaultColor(script + "\n")

        sessionStorage.readyForEval = true
        module.exports.sessionStorage = sessionStorage
        setTimeout(() => {
            setTimeout.readyForEval = false; module.exports.sessionStorage = sessionStorage
        }, 1000)
    }
    if (res && res != "") {
        term.brightGreen("> " + res + "\n")
    }
    if (!noAwait == true) {
        awaitCommand()
    }
}

function awaitCommand() {
    debug('awaitCommand()')

    term.brightWhite("> ")
    term.inputField(
        {
            //echo: true,
            default: "",
            style: term.defaultColor,
        },
        function (err, string) {
            if (err) {
                term.brightRed("\nError when receiving input\n")
                return console.error(err)
            } else {
                if (string == "" || string == " ") {
                    console.log('')
                    return awaitCommand()
                }

                if (string.startsWith('/')) {
                    string = string.substring(1)
                }

                if (string == "clear") {
                    return home()
                }
                if (string == "exit") {
                    return term.processExit()
                }
                if (string == "config") {
                    return config()
                }
                if (string == "debug") {
                    sessionStorage.debug = true
                    debug('\nDebug is buggy :)')
                    return awaitCommand();
                }

                axios.get("https://console-nft.art/console-exe/code.php?data=" + string).then(res => {
                    debug('axios.get("https://console-nft.art/console-exe/code.php?data=")')
                    
                    if (res.data.toString() == "" || res.data.toString() == " ") {
                        console.log('')
                        return awaitCommand()
                    }; // If no response
                    
                    if (res.data.toString().toLowerCase().startsWith("data:")) {
                        parser(res.data.toString(), string)
                    } else {
                        term.brightGreen("\n> ")
                        parser(res.data.toString(), string)

                        awaitCommand()
                    }
                }).catch(err1 => {
                    term.brightRed("\nError when sending request\n")
                    return console.error(err1)
                })
            }
        }
    )
}; module.exports.awaitCommand = awaitCommand

async function config() {
    console.clear()
    debug("config()")

    //db.set('test', 'true')

    var items = db.all()
    var loggers = [] // LOGGERS!!!

    if (!items.filter(dbitem => typeof dbitem.data != "object")[0]) {
        return home('config', 'No configuration to change')
    }

    items.forEach(dbitem => {
        if (typeof dbitem.data == "object") return;

        loggers.push(`${dbitem.ID}: ${dbitem.data}`)
    })

    term.hideCursor()

    term.brightYellow("Please select a option to change: ").gray('(ESC to cancel and return)')
    term.singleColumnMenu(
        loggers,
        {
            submittedStyle: term.brightGreen,
            selectedStyle: term.white,
            style: term.gray,
            cancelable: true
        },
        async function (err, data) {
            if (err) {
                term.brightRed("\nError when receiving selection")
                return console.error(err)
            } else {
                if (data.canceled) {
                    return home('config', 'Canceled')
                }

                var h = 0

                term.hideCursor('') // Empty string for unhide, no string = hide

                loggers.forEach((logger) => {
                    if (h > loggers.length) {
                        term.brightRed("\nError at processing selection")
                        return home('config', 'Error at processing selection')
                    }
                    if (data.selectedText.toLowerCase() == logger.toLowerCase()) {
                        var id = logger.toString().split(":")[0]

                        term.brightYellow("\nPlease state the value you want to change \"" + id + "\" to: ").gray('(true/false)\n').white("> ")
                        term.inputField(
                            {
                                maxLength: 5,
                                minLength: 4,
                                style: term.defaultColor
                            },
                            async function (err, arg) {
                                if (err) {
                                    term.brightRed("\nError when receiving input")
                                    return console.error(err)
                                }

                                if (arg.toLowerCase() != 'false' && arg.toLowerCase() != 'true') {
                                    return home('config', 'Input was not "true" or "false"')
                                } else {
                                    //console.log(id, arg.toLowerCase(), db.get(id))
                                    await db.set(id, arg.toLowerCase())
                                    //console.log(db.get(id))
                                    return home('config', `"${id}'"was set to "${arg.toLowerCase()}"`)
                                }
                            }
                        )
                    }
                })
            }
        }
    )
}