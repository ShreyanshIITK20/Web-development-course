require('dotenv').config();                                                      //configuring environment variable
const bodyParser = require("body-parser");
const ejs = require("ejs");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;                                                          //successive rounds of salting done during the procedure to get the final password
// const md5 = require("md5");
// const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
  }));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({                                        //Mongoose schema for each user (not just simple JS object like we did earlier)
    email: String,
    password: String
});

// userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields:["password"]});       //encryption plugin added to increase the functionality of schema and encrypt the password field of it

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
    
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({                          //created a new user's account using the information posted through register form
            email: req.body.username,
            password: hash                                  //hashed password created using the bcrypt
        });
        
        newUser.save(function(err){
            if(err) console.log(err);
            else res.render("secrets");                     //if there are no errors then render the secrets.ejs page and it is the only way to access the secrets page since above we have no other GET request for secrets page
        }); 
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
                bcrypt.compare(password, foundUser.password, function(err, result) {            //bcrypt's compare method to compare the user entered password and the hashed password
                    console.log(result);
                    if(result===true) res.render("secrets");                                    //if found a user with same hash then result will be true else false
                });               
            }
        }
    });
});
app.listen(3000,function(){
    console.log("Server running on port 3000");
});
