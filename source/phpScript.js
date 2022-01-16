/**
 ** This script will be used if scripts from the web will be executed
 ** The script will be shown on the screen and a yes/no prompt if you want to execute it
 *! If you want to see where scripts are executed, search for the string 'eval(', 
 *! I recommend Visual Studio Code because you can see every file in the folder that has it (There should be 2, both in this file)
 */

var term = require("terminal-kit").terminal
/**
 * @param {String} string Script to execute
 * @param {String} command
 */
module.exports = async function (string, command) {
    console.clear()

    var exec = string
    if (string.startsWith(" ")) exec = exec.substring(1);
    exec = exec.split("*.NEWLINE.*").join("\n")

    term(exec)

    term.brightYellow("\n\nDo you want this script to run? ").gray("[y/n]\n")
    term.yesOrNo(
        {
            echoNo: false,
            echoYes: false,

            yes: [
                'y',
                'yes'
            ],
            no: [
                'n',
                'no'
            ]
        },
        async function (err, res) {
            if (err) {
                return term.brightRed("\nError when user input")
            }

            if (res) {
                console.clear()
                require("./index").home(command, "", true)

                try {
                    var yes = false;
                    var intv = setInterval(() => {
                        if (yes == true) return clearInterval(intv);

                        if (require("./index").sessionStorage.readyForEval == true) {
                            yes = true; clearInterval(intv)

                            eval(exec)

                            //require("./index").awaitCommand()
                            term.brightWhite("> ")
                        }
                    }, 100)
                } catch (err1) {
                    term.brightRed("\nError at executing script")
                    return console.error(err1)
                }
            } else {
                console.clear()
                require("./index").home(command, "User denied\n", false)
            }
        }
    )
}