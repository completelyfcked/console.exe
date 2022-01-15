const axios = require("axios").default // Requests
const prompt = require("prompt") // Questions
var term = require("terminal-kit").terminal // Console Markup & MOre

process.title = "console.exe"
login1()

term.on('key', function (name, matches, data) {
    if (name === 'CTRL_C') { term.processExit(); }
});

function login1() {
    console.clear()

    term.brightRed("Please choose a login method: ")
    term.gray("(ESC to cancel)")
    term.singleColumnMenu(
        [
            "> Discord Tag",
            "> Discord Id"
        ],
        {
            style: term.gray,
            selectedStyle: term.defaultColor,
            submittedStyle: term.brightBlue,
            cancelable: true
        },
        function (err, res) {
            if (err) {
                console.error(err)
            } else {
                if (res.canceled) {
                    term.brightWhite("Cancelled")
                    //return term.processExit()
                }; console.clear()
                
                login2(res)
            }
        }
    )
}

/**
 * 
 * @param {} res 
 */
function login2(res) {
    switch (res.selectedIndex) {
        case 0:
            term.brightRed("Please state your Discord Tag: ")
            term.gray("(CTRL + C to cancel)\n")
            term.inputField(
                {
                    //style: term.brightWhite,
                    minLength: 5,
                    maxLength: 32,
                    default: ""
                }, function (err, string) {
                    term.brightYellow("\n\nConnecting to authentication server")

                    // REQUEST
                    axios.get("http://cnft.server.rubendb.nl/cmdauthtag", { params: { 'tag': string } }).then((response) => {
                        if (response.status != 200) {
                            term.brightRed("\nCould not connect to authentication server\n")
                            term.gray(`Status Code: ${response.status}\nStatus Message: ${response.statusText}`)

                            //term.processExit()
                        } else {
                            if (!response.data.toString().startsWith('true')) {
                                term.brightRed("\nFailed to authenticate\n\n")
                                term.brightWhite("Try a different login method at next start")
                            } else {
                                term.brightGreen("nuthenticated")

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
            break;
                    
        case 1:
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
                    axios.get("http://cnft.server.rubendb.nl/cmdauthid", { params: { 'id': string } }).then((response) => {
                        if (response.status != 200) {
                            term.brightRed("\nCould not connect to authentication server\n")
                            term.gray(`Status Code: ${response.status}\nStatus Message: ${response.statusText}`)
                            term.processExit()
                        } else {
                            if (!response.data.toString().startsWith('true')) {
                                term.brightRed("\nFailed to authenticate\n\n")
                                term.brightWhite("Try a different login method at next start")
                            } else {
                                term.brightGreen("\nAuthenticated")

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
            break;
    }
}

/**
 * 
 * @param {String} string 
 */
function home() {
    console.clear()

    var welcomeMessage = ""; var date = new Date().getHours(); if (date < 12) { welcomeMessage = "Goodmorning." } else if (date < 16) { welcomeMessage = "Good afternoon." } else { welcomeMessage = "Good evening." }; welcomeMessage = welcomeMessage + "\n\n"; term.brightGreen(welcomeMessage)
}