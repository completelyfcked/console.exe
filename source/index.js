const axios = require("axios").default // Requests
const prompt = require("prompt") // Questions
var term = require("terminal-kit").terminal // Console Markup & MOre

process.title = "console.exe"
var sessionStorage = {}

term.on('key', function (name, matches, data) {
    if (name === 'CTRL_C') { term.processExit(); }
});

function loginPrompt() {
    console.clear()

    term.grey("Learn more about Discord Id's at https://www.remote.tools/remote-work/how-to-find-discord-id\n")
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

            // REQUEST
            axios.get("http://cnft.server.rubendb.nl/cmdauth", { params: { 'id': string } }).then((response) => {
                if (response.status != 200) {
                    term.brightRed("\nConnection to authentication server failed\n")
                    term.gray(`Status Code: ${response.status}\nStatus Message: ${response.statusText}`)
                    term.processExit()
                } else {
                    if (!response.data.toString().startsWith('true')) {
                        term.brightRed("\nFailed to authenticate\n\n")
                        term.brightWhite("Contact "); term.brightBlue('completelyfcked#0001'); term.brightWhite(' to resolve/report this issue.')
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

/**
 * 
 * @param {String} string 
 */
function home() {
    console.clear()

    var trail = "."
    var color = term.brightWhite
    var welcomeMessage = ""; var date = new Date().getHours(); if (date < 12) { welcomeMessage = "Goodmorning, " + sessionStorage.username } else if (date < 16) { welcomeMessage = "Good afternoon, " + sessionStorage.username } else { welcomeMessage = "Good evening, " + sessionStorage.username }; welcomeMessage = welcomeMessage + trail; color(welcomeMessage)
}