const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
var name="";

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  res.render("index",{playerName : name});
});

app.post("/", function (req,res) {
  name=req.body.playerName;
  var playerID;
  
  const urlPlayer = "https://www.balldontlie.io/api/v1/players?search="+name;
  https.get(urlPlayer, function (response) {
    response.on("data", function (data) {
      const player = JSON.parse(data);
      playerID = player.data[0].id;
      const urlPlayerStat = "https://www.balldontlie.io/api/v1/season_averages?player_ids[]=" + playerID;
      
      https.get(urlPlayerStat, function (response) {
        response.on("data", function (data) {
          const playerStat = JSON.parse(data);
          
          res.render("result", {
            playerName: player.data[0].first_name + " " + player.data[0].last_name,
            height: player.data[0].height_feet + "\' " + player.data[0].height_feet + "\"",
            team: player.data[0].team.full_name,
            min: playerStat.data[0].min,
            pts: playerStat.data[0].pts,
            ast: playerStat.data[0].ast,
            reb: playerStat.data[0].reb,
            stl: playerStat.data[0].stl,
            blk: playerStat.data[0].blk,
            turnover: playerStat.data[0].turnover
          });
        });
      });
    });
  });
  
  
});

app.listen(3000,function(){
  console.log("Server Running");
});

