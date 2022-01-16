const axios = require("axios").default // Requests
const prompt = require("prompt") // Questions
var term = require("terminal-kit").terminal // Console Markup & More
const parser = require("./responseParse") // Filter & Markup

process.title = "Console.exe"
var sessionStorage = {}

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

function commandServerPing() {
    axios.get("https://console-nft.art/console-exe/code.php?data=exe-ping").then((ping) => {
        switch (ping.data.toString().split("*.SPLIT.*").join("")) {
            case 'true':
                term.brightGreen("\nServer is online\n")
                term.gray("Created by "); term.bold.colorRgb(248, 23, 0, "completelyfcked\n");
                firstCommand()
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
 * 
 * @param {String} string 
 */
function home() {
    console.clear()

    var trail = ".\n" // After "Goodmorning, ", "Good afternoon, ", "Good evening, "
    var msgColor = term.brightWhite; var nameColor = term.brightCyan;
    var date = new Date().getHours(); var welcomeMessage = "";
    if (date < 12) {
        welcomeMessage = "Goodmorning, "
    } else if (date < 16) {
        welcomeMessage = "Good afternoon, "
    } else {
        welcomeMessage = "Good evening, "
    }; msgColor(welcomeMessage); nameColor(sessionStorage.username); msgColor(trail)

    // Check if server is online
    commandServerPing()
}

function firstCommand() {
    term.defaultColor('Type your command(s) below\n\n')
    awaitCommand()
}

function awaitCommand() {
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

                if (string == "clear") {
                    return home()
                }
                if (string == "exit") {
                    return term.processExit()
                }
                if (string == "config") {
                    return config()
                }

                axios.get("https://console-nft.art/console-exe/code.php?data=" + string).then(res => {
                    if (res.data.toString() == "") {
                        console.log('')
                        return awaitCommand()
                    }; // If no response
                    
                    term.brightGreen("\n> ")
                    parser(res.data.toString())
                    
                    awaitCommand()
                }).catch(err1 => {
                    term.brightRed("\nError when sending request\n")
                    console.error(err1)
                })
            }
        }
    )
}

function config() {
    
}