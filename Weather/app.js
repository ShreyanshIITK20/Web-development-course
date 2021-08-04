const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html")
});

app.post("/",function(req,res){
    const query = req.body.cityName;
    const apikey = "5a96434b02cea77485ba6bb4c1d9bb7a";
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?units=" + units + "&q="+ query + "&appid=" + apikey;
    https.get(url,function(response){
        response.on("data",function(data){
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const iconURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png"; 
            res.write("<h1>Temperature of "+query+ " is "+temp+" degree celcius.</h1>");
            res.write("<h2>Weather description : "+weatherDescription+".</h2>");
            res.write("<img src="+iconURL+">");
            res.send();

        });
    });
});

app.listen(3000,function(){
    console.log("Server is running on port 3000.");
});