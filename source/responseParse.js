var term = require("terminal-kit").terminal
const link = require("hyperlinker")

/**
 * @param {String} string server response
 * @param {*} term terminal-kit instance
 * @returns {String}
 */
module.exports = async function parse(string) {
    try {
        var split = string.split("*.SPLIT.*")
        split = split.filter(f => f != '')

        //var nodes = html.parse(text).childNodes[0].childNodes.filter(f => f.nodeName == 'body')[0].childNodes
        // split.forEach(text => {
        //     var result = ""
        //     var nodes = html.parse(text).childNodes[0].childNodes.filter(f => f.nodeName == 'body')[0].childNodes
            
        //     nodes.forEach(node => {
        //         if (node.nodeName == "#text") {
        //             result = result + node.value + "\n"
        //         }
        //         if (node.nodeName == "a") {
        //             result = result + term.brightCyan(node.attrs.find(f => f.name == "href").value) + "\n"
        //         }
        //     })

        //     term.brightGreen(result)
        // })

        if (split.join(" ").toLowerCase().startsWith("data:")) {
            term.hideCursor()

            console.clear()

            for (var i = 0; i < ((process.stdout.rows / 2) - 1); i++) {
                console.log("")
            }

            console.log(split.join(" ").split("data:").join("").substring(1))

            // Line 43 likes to end the string with a ">" for no reason lol
            //term.white(split.join(" ").substring(1).split("data:").join(""))
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