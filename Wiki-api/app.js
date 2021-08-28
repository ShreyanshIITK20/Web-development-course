const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article",articleSchema);

/////////////////////////////////////////////////REQUEST TARGETING ALL ARTICLES///////////////////////////////////////////////////////////

app.route("/articles")                                                 //using EXPRESS's route method to combine multiple methods into a single block of code instead of calling out get/post/delete seperately for same route

.get(function(req,res){
    Article.find({},function(err,foundArticles){                        //tap into Article model, and find all the articles present in it and console log it
        // console.log(foundArticles);
        if(!err){
            res.send(foundArticles);
        }
        else res.send(err)
    })
})

.post(function(req,res){
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if(!err) res.send("Successfully executed");
        else res.send(err);
    });
})

.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err) res.send("Successfully deleted");
        else res.send(err);
    })
});

/////////////////////////////////////////////////REQUEST TARGETING A SPECIFIC ARTICLE/////////////////////////////////////////////////////

app.route("/articles/:articleTitle")                                //dynamic url using express params

.get(function(req,res){
    Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
        if(!err) res.send(foundArticle);
        else res.send("No article found");
    });
})

.put(function(req,res){                                                     //here we are updating/replacing the article completely using the title and content provided by user 
    Article.replaceOne(                                                      
        {title: req.params.articleTitle},                                   //find article with this dynamic url name (condition)
        {title: req.body.title, content: req.body.content},                 //update article with new title and content as provided by the form in body uusig bodyparser (some EJS file)
        function(err){
            if(!err) res.send("Successfully updated");
        }
    );
})

.patch(function(req,res){
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err) res.send("Successfully patched");
        }
    );
})

.delete(function(req,res){
    Article.deleteOne(
        {title: req.body.title},
        function(err){
            if(!err) res.send("Successfully deleted");
        }
    );
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});