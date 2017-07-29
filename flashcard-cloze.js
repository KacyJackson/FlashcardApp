// require fs
var fs = require("fs");

module.exports = ClozeFlashcard;

//  ClozeFlashcard constructor
function clozeFlashcard(text, cloze) {
    this.text = text;
    this.cloze = cloze;
    this.clozeDeleted = this.text.replace(this.cloze, '_____');
    this.create = function() {
        var data = {
            text: this.text,
            cloze: this.cloze,
            clozeDeleted: this.clozeDeleted,
            type: "cloze"
        };
       
        // add card to log.txt
        fs.appendFile("log.txt", JSON.stringify(data) + ';', "utf8", function(error) {
            
            // log errors
            if (error) {
                console.log(error);
            }
        });
    };
}
