var term = require("terminal-kit").terminal

/**
 * @param {String} string server response
 * @param {String} command the command that requested this
 * @returns {String}
 */
module.exports = async function parse(string, command) {
    try {
        var split = string.split("*.SPLIT.*")
        split = split.filter(f => f != '')

        if (split.join(" ").toLowerCase().startsWith("data:")) {
            console.clear()

            for (var i = 0; i < ((process.stdout.rows / 2) - 1); i++) {
                console.log("")
            }

            //console.log(split.join(" ").split("data:").join("").substring(1))
            console.log(split.join(" ").split("data:").join("")) //* substring removes the first character if there is no space after 'data:'
        } else if (split.join(" ").toLowerCase().startsWith("script:")) {
            //! Script Parser
            var string = split.join(" ").split("script:").join("")

            require("./phpScript")(string, command)
        } else {
            split.forEach((text) => {
                if (text.includes("http://") || text.includes("https://")) {
                    var method = ""; if (text.includes("http://")) method = "http://";
                    if (text.includes("https://")) method = "https://";
    
                    var t = text.split(method)
                    term.brightGreen(t[0])
                    
                    term.brightCyan(method + t[1] + "\n")
                } else {
                    term.brightGreen(text + "\n")
                }
            })
        }
    } catch (err) {
        term.brightRed("\nError while parsing\n")
        console.error(err)
    }
}