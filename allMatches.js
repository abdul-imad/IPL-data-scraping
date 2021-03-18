let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
function matches(url){
    request(url, cb);
}
let arr = [];
function dirCreator(src){
    if(fs.existsSync(src) == false){
        fs.mkdirSync(src);
    }
}
let j = 1;
function cb(err, response, html) {
    let chSelector = cheerio.load(html);
    let tables = chSelector(".table.batsman");
    let teams = chSelector(".event .teams .name");
    for(let i = 0 ; i < 2 ; i++){
        let teamName = chSelector(teams[i]).text();
        const pathOfFolder = path.join(__dirname,'\\IPL',teamName);
        dirCreator(pathOfFolder);
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
                arr.push(playerObj);
                let fileName = playerName;
                let filePath = path.join(__dirname,'\\IPL',);
                let playerTeam = chSelector(".header-title.label").text();
                for(let k = 0 ; k < 2 ; k++){
                    console.log(playerTeam[k]);
                }
                

                
            }
        }
        //console.table(arr);
        
    }

}

module.exports = {
    matches : matches
}
