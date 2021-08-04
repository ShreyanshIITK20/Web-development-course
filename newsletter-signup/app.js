const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

app.use(express.static("public"));  //define a static location of folder "public" for using css and images in html
app.use(bodyParser.urlencoded({extended:true}));        //to use body parser

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;

    const data = {                                  //defining a JS object for our API request
        members: [
            {
                email_address : email,
                status : "subscribed",
                merge_field : {
                    FNAME : firstname,
                    LNAME : lastname,
                }

            }
        ]
    };

    const jsonData = JSON.stringify(data);          //coverting JS object into a JSON object
    
    const url = "https://us5.api.mailchimp.com/3.0/lists/8d04e43263";
    const options = {
        method : "POST",
        auth : "shreyansh:7ad21171abd250921ac6959b427c85c7-us5"
    }

    const request = https.request(url,options,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else {
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    });

    // request.write(jsonData);
    request.end();
});

app.post("/failure.html",function(req,res){
    res.redirect("/")
})

app.listen(3000,function(){
    console.log("Server is running on port 3000.");
});

//apikey 7ad21171abd250921ac6959b427c85c7-us5
//list id 8d04e43263