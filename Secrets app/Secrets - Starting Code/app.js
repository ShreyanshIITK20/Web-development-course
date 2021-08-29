const bodyParser = require("body-parser");
const ejs = require("ejs");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
  }));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema = {                                                            //schema for each user
    email: String,
    password: String
};

const User = new mongoose.model("User",userSchema);                             //model for containing information of user


app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

//user will go to register page and enter an email and password which will be submitted as a POST request which we are required to catch now
app.post("/register",function(req,res){
    console.log(req.body.username);
    const newUser = new User({                          //created a new user's account using the information posted through register form
        email: req.body.username,
        password: req.body.password
    });
    
    newUser.save(function(err){
        if(err) console.log(err);
        else res.render("secrets");                     //if there are no errors then render the secrets.ejs page and it is the only way to access the secrets page since above we have no other GET request for secrets page
    });
});


//For the login page user will come and enter his email and password and we will have to check whether an account with those credentials exist or not in our database
app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username},function(err,foundUser){
        if(err) console.log(err);
        else {
            if(foundUser){                                          //foundUser = 0 if nobody found so it wont evaluate
                if(foundUser.password === password){                //foundUser's password is same as entered password in our for
                    res.render("secrets");
                }                 
            }
        }
    });
});
app.listen(3000,function(){
    console.log("Server running on port 3000");
});
