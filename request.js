let request = require("request");
let fs = require("fs");
let path = require("path");
let cheerio = require("cheerio");
// let everyMatch = require("./allMatches");

request("https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results", cb);
let arr = [];
function cb(err, response, html){
    if(err){
        console.error(err);
    }
    else{
        let cheerioSelector = cheerio.load(html);
        let buttons = cheerioSelector(".btn.btn-sm.btn-outline-dark.match-cta");
        //console.log(buttons.length);
        for(let i = 2 ; i < buttons.length ; i += 4){
            let scoreCardLink = cheerioSelector(buttons[i]).attr("href").trim();
            let fullLink = "https://www.espncricinfo.com" + scoreCardLink;
            request(fullLink, allMatches);
        }
    }
}
function dirCreator(src){
    if(fs.existsSync(src) == false){
        fs.mkdirSync(src);
    }
}
function allMatches(err, response, html) {
    let chSelector = cheerio.load(html);
    let tables = chSelector(".table.batsman");
    let teams = chSelector(".event .teams .name");
    for(let i = 0 ; i < 2 ; i++){
        let teamName = chSelector(teams[i]).text();
        let pathOfFolder = path.join(__dirname,teamName);
        dirCreator(pathOfFolder);
        //console.log( j ,teamName);
        
    }
    for (let i = 0; i < tables.length; i++) {
        let teamBowlers = chSelector(tables[i]).find("tr");
        //console.log(teamBowlers.length);
        for (let j = 0; j < teamBowlers.length; j++) {
            let eachbowlcol = chSelector(teamBowlers[j]).find("td");
            //console.log(eachbowlcol.length);
            if (eachbowlcol.length == 8) {
                let playerName = chSelector(eachbowlcol[0]).text();
                let outDescription = chSelector(eachbowlcol[1]).text();
                let runs = chSelector(eachbowlcol[2]).text();
                let balls = chSelector(eachbowlcol[3]).text();
                let fours = chSelector(eachbowlcol[5]).text();
                let sixes = chSelector(eachbowlcol[6]).text();
                let strikeRate = chSelector(eachbowlcol[7]).text();

                let playerObj = {
                    name : playerName,
                    status : outDescription,
                    runs : runs,
                    balls : balls,
                    fours : fours,
                    sixes : sixes,
                    SR : strikeRate
                }
                console.log(playerObj);

                
            }
        }
        console.table(arr);
        
    }

}