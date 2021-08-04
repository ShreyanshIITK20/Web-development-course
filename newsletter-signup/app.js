const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");

app.use(express.static("public"));  //define a static location of folder "public" for using css and images in html
app.use(bodyParser.urlencoded({extended:true}));        //to use body parser

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){
    var firstname = req.body.fname;
    var lastname = req.body.lname;
    var email = req.body.email;
    console.log(firstname, lastname, email);
});

app.listen(3000,function(){
    console.log("Server is running on port 3000.");
});