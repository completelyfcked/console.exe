const axios = require("axios").default // Requests
var term = require("terminal-kit").terminal // Console Markup & More
const parser = require("./responseParse") // Filter & Markup

process.title = "Console.exe"
var sessionStorage = {}
module.exports.sessionStorage = sessionStorage;

const debug = (string) => { if (sessionStorage.debug) { term.brightCyan("DEBUG: ").white(string + "\n") } }

term.on('key', function (name, matches, data) {
    if (name === 'CTRL_C') { term.processExit(); }
});

function loginPrompt() {
    console.clear()

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
                        sessionStorage.id = string
                        sessionStorage.username = response.data.toString().split(":")[1]

                        home()
                    }
                }
            }).catch(err => {
                term.brightRed("\nCould not connect to authentication server\n")
                console.error(err)

                //term.processExit()
            })
        }
    )
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
                console.error(err)
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
                }

                axios.get("https://console-nft.art/console-exe/code.php?data=" + string).then(res => {
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
                    console.error(err1)
                })
            }
        }
    )
}; module.exports.awaitCommand = awaitCommand

function config() {
    
}