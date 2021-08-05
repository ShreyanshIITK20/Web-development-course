const express = require("express");
const bodyParser = require("body-parser");

const app = express();

var items = ["Get jabbed","Get a haircut","Complete assignments"];      //initial array to start with

app.set("view engine","ejs");       //telling our server to set EJS as view engine

app.use(bodyParser.urlencoded({extended:true}));        //for setting up body-parser in our JS

app.get("/",function(req,res){              //request to get the date
    var today = new Date();
    
    var options = {                 //defined JS object for formatting date (as shown on stackoverflow)
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    var day = today.toLocaleDateString("en-US",options);        //first parameter is region, and second is options for formatting

    res.render("list",{kindOfDay : day,newListItems : items});       //if-else will take care of day, and will finally plugin the right value
});

app.post("/",function(req,res){             //post request to handle the newly added item in our list
    var item = req.body.newItem;            //store newly added item in a variable
    items.push(item);                       //append the array of newly listed items
    res.redirect("/");                      //redirect to app.get to process the render request with newly appended array
})

app.listen(3000,function(){
    console.log("Server is running on port 3000");
});