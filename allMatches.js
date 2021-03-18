let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
function matches(url){
    request(url, cb);
}
function dirCreator(src){
    if(fs.existsSync(src) == false){
        fs.mkdirSync(src);
    }
}
let teamName;
function cb(err, response, html) {
    let chSelector = cheerio.load(html);
    let tables = chSelector(".table.batsman");
    let teams = chSelector(".event .teams .name");
    let date = chSelector(".match-info.match-info-MATCH .description").text().split(",")[2].trim();
    let venue = chSelector(".match-info.match-info-MATCH .description").text().split(",")[1].trim();
    
    for(let i = 0 ; i < 2 ; i++){
        teamName = chSelector(teams[i]).text();
        if(teamName === "Kings XI Punjab"){
            teamName = "Punjab Kings";
        }
        const pathOfFolder = path.join(__dirname,'\\IPL',teamName);
        dirCreator(pathOfFolder);
    }
    let playerTeam = chSelector(".header-title.label");
    for (let i = 0; i < tables.length; i++) {
        let teamBatsmen = chSelector(tables[i]).find("tr");
        let eachPlayerTeam = chSelector(playerTeam[i]).text().split("INNINGS")[0].trim() ;
        for (let j = 0; j < teamBatsmen.length; j++) {
            let eachbowlcol = chSelector(teamBatsmen[j]).find("td");
            if (eachbowlcol.length == 8) {
                let playerName = chSelector(eachbowlcol[0]).text().trim();
                playerName=playerName.replace(/ +/g, "");
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
                    SR : strikeRate,
                    "match date" : date,
                    "match venue" : venue,
                }
                
                let fileName = playerName;
                let filePath = path.join(__dirname,'\\IPL',eachPlayerTeam , fileName + ".json");
                if(fs.existsSync(filePath) == false){
                    fs.openSync(filePath, "a");
                    let arr1 = [];
                    arr1.push({
                        name : playerName,
                        status : outDescription,
                        runs : runs,
                        balls : balls,
                        fours : fours,
                        sixes : sixes,
                        SR : strikeRate,
                        "match date" : date,
                        "match venue" : venue,
                    });
                    let contentInEmptyFile = JSON.stringify(arr1,null,4);
                    fs.writeFileSync(filePath, contentInEmptyFile);

                }
                else{
                    let contentInFile = fs.readFileSync(filePath);
                    let arr = JSON.parse(contentInFile);
                    arr.push(playerObj);
                    // fs.appendFileSync(filePath, content);   
                    fs.writeFileSync(filePath, JSON.stringify(arr,null,4));
                }
            }
        }
    }
}
module.exports = {
    matches : matches
}
