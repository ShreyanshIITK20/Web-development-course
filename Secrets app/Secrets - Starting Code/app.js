//Here we will add the cookie on login with a time limit of your browser session. As soon as you end your browser session the cookie gets detroyed but in between that you can direct open the secrets page without bothering about the login

require('dotenv').config();                                                      //configuring environment variable
const bodyParser = require("body-parser");
const ejs = require("ejs");
const express = require("express");
const mongoose = require("mongoose");

const session = require("express-session");                                      //we need to import 3 new modules to be able to set authentication using passport
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(session({                                                               //set up session with certain conditions
    secret: "My little tiny secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());                                                 //initialise the passport to be used
app.use(passport.session());                                                    //use the passport for dealing with sessions

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({                                        //Mongoose schema for each user (not just simple JS object like we did earlier)
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);                                       //used to hash and salt our passwords and save the user in mongoDB database

const User = new mongoose.model("User",userSchema);                             //model for containing information of user

//below 3 line code is the heart of using passport, and here is serialize (create cookies) and then deserialize (destrpy them) according to the situation
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/logout",function(req,res){                                            //logout route only defined in case of passport authentication which deserialize the user
    req.logout();
    res.redirect("/");
});

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/secrets",function(req,res){
    //if the user is authenticated then render the secrets page else do not render it and send the user (redirect) back to login page
    if(req.isAuthenticated()){
        res.render("secrets");
    } else{
        res.redirect("/login");                                      //not just rendering, we are sending them back to the login route if not authenticated
    }
});

//user will go to register page and enter an email and password which will be submitted as a POST request which we are required to catch now
app.post("/register",function(req,res){
    //we will use passport-local-mongoose method's to setup the user now. Here we will use .register method where we have to set 3 parameters named username, passowrd and a callback function
    User.register({username: req.body.username}, req.body.password, function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res,function(){              //checking for authentication and if authenticated then the callback function is called and it redirects use to /secrets route. Now since we are directed instead of rendering, we have to set up a GET request for /secrets route as well
                res.redirect("/secrets");
            });
        }
    });
});


//For the login page user will come and enter his email and password and we will have to check whether an account with those credentials exist or not in our database
app.post("/login",function(req,res){
    
    const user = new User({                                                 //create new user with entered credentials
        username: req.body.username,
        password: req.body.password
    });

    req.login(user,function(err){
        if(err) console.log(err);
        else{
            passport.authenticate("local")(req,res,function(){              //again authenticating the user on login and if its authenticated then we call the callback function which redirects us to the /secrets route
                res.redirect("/secrets");
            });
        }
    })
});
app.listen(3000,function(){
    console.log("Server running on port 3000");
});
