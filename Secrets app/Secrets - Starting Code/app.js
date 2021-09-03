//Here we will add the cookie on login with a time limit of your browser session. As soon as you end your browser session the cookie gets detroyed but in between that you can direct open the secrets page without bothering about the login

require('dotenv').config();                                                      //configuring environment variable
const bodyParser = require("body-parser");
const ejs = require("ejs");
const express = require("express");
const mongoose = require("mongoose");

const session = require("express-session");                                      //we need to import 3 new modules to be able to set authentication using passport
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;               //Google OAuth package
const findOrCreate = require("mongoose-findorcreate");                            //Used in Google authentication using passport

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
    password: String,
    googleId: String,
    secret: String
});

userSchema.plugin(passportLocalMongoose);                                       //used to hash and salt our passwords and save the user in mongoDB database
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User",userSchema);                             //model for containing information of user

//below 3 line code is the heart of using passport, and here is serialize (create cookies) and then deserialize (destrpy them) according to the situation
passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {                                   //general code for serialising and deserialing any kind of strategy
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new GoogleStrategy({                                               //this must be placed after the serialise and deserialise code
    
    clientID: process.env.CLIENT_ID,                                            //ID,secret provided by Google along with redirect URL setup on Google dev platform
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/logout",function(req,res){                                            //logout route only defined in case of passport authentication which deserialize the user
    req.logout();
    res.redirect("/");
});

app.get("/",function(req,res){
    res.render("home");
});

app.get("/auth/google",                                                        //route where the google signin or register button will redirect to
    //here we are supposed to authenticate the use using the passport
    passport.authenticate('google',{scope:["profile"]})  
);

app.get("/auth/google/secrets",                                               //this is the route which google will call after its authentication 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to secrets page.
    res.redirect('/secrets');

    //this will send a request to /secrets route where we have already set up a authentication, which will check if the user is authenticated or not
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/secrets",function(req,res){
    //this is an anonymous page so anyone can view all the secrets at one place so no authentication needed for this
    //now we need to display all the secrets that our database has (of all users), for that we will search for entries in our database which has non empty 'secret' field
    
    User.find({"secret":{$ne:null}},function(err,foundUsers){
        if(err) console.log(err);
        else{
            if(foundUsers){
                res.render("secrets",{userWithSecrets:foundUsers});             //userWithSecrets is used to render the contents in our ejs file, wherein we will loop through all the users and their secrets
            }
        }
    });
});

app.get("/submit",function(req,res){
    if(req.isAuthenticated()){
        res.render("submit");
    } else{
        res.redirect("/login");                                      //not just rendering, we are sending them back to the login route if not authenticated
    }
});

app.post("/submit",function(req,res){
    const submittedSecret = req.body.secret;                         //retrieve the secret sent in by the user on secret.ejs page

    //now we want to find the current (logged in) user's database and save this secret into his database. Passport very smartly saves the current user in 'req' 
    //for storing secret we need to also include secret in the schema

    User.findById(req.user.id,function(err,foundUser){                  //find the user database with the currently logged in session's information and add the secret 
        if(err) console.log(err);
        else{
            if(foundUser){                                              //if found the user then add secret to its database
                foundUser.secret = submittedSecret;
                foundUser.save(function(){
                    res.redirect("/secrets");                           //when submitted and saved successfully then redirect to the secrets page to check all the secrets
                });
            }
        }
    });
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
