const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let items = ["Get jabbed","Get a haircut","Complete assignments"];      //initial array to start with
let workItems = [];

app.set("view engine","ejs");       //telling our server to set EJS as view engine

app.use(bodyParser.urlencoded({extended:true}));        //for setting up body-parser in our JS
app.use(express.static("public"));                      //for setting up static folder which contains css/js files to be rendered

app.get("/",function(req,res){              //request to get the date
    let today = new Date();
    
    let options = {                 //defined JS object for formatting date (as shown on stackoverflow)
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-US",options);        //first parameter is region, and second is options for formatting

    res.render("list",{listTitle : day,newListItems : items});       //if-else will take care of day, and will finally plugin the right value
});

app.post("/",function(req,res){             //post request to handle the newly added item in our list
    let item = req.body.newItem;            //store newly added item in a variable
    
    if(req.body.list === "Work"){           //checks if the input came from a to-do list page or work list page and act accordingly
        workItems.push(item);
        res.redirect("/work");
    } else{
        items.push(item);                       //append the array of newly listed items
        res.redirect("/");                      //redirect to app.get to process the render request with newly appended array
    }
    
});

//Above procedure repeated for a new endpoint /work is given below

app.get("/work",function(req,res){
    res.render("list",{listTitle : "Work list",newListItems : workItems})
});

//we have not added app.post method here because our form in EJS file redirects the input to "/" ,
//so we have to build our logic in app.post method of "/" part only

app.get("/about",function(req,res){
    res.render("about");
})

app.listen(3000,function(){
    console.log("Server is running on port 3000");
});