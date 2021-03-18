let request = require("request");
let fs = require("fs");
let path = require("path");
let cheerio = require("cheerio");
let everyMatch = require("./allMatches");

request("https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results", cb);

function iplFol(src) {
    if(fs.existsSync(src) == false){
        fs.mkdirSync(src);
    }
}
function cb(err, response, html){
    if(err){
        console.error(err);
    }
    else{
        let IPLFolder = path.join(__dirname,"IPL");
        iplFol(IPLFolder);
        let cheerioSelector = cheerio.load(html);
        let buttons = cheerioSelector(".btn.btn-sm.btn-outline-dark.match-cta");
        for(let i = 2 ; i < buttons.length ; i += 4){
            let scoreCardLink = cheerioSelector(buttons[i]).attr("href").trim();
            let fullLink = "https://www.espncricinfo.com" + scoreCardLink;
            everyMatch.matches(fullLink);
        }
    }
}
