//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");                                               //importing mongoose

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});    //connecting mongoose to port 27017

const itemsSchema = {
  name : String
};

const Item = mongoose.model("Item",itemsSchema);                                    //modeled a collection called Item with the itemScheme created

const item1 = new Item ({
  name : "Hey I am item 1"
});

const item2 = new Item ({
  name : "Hey I am item 2"
});

const item3 = new Item ({
  name : "Hey I am item 3"
});

const defaultItems = [item1,item2,item3];                                           //made an array containing default 3 items
Item.insertMany(defaultItems,function(err){
  if(err) console.log(err);
  else console.log("Successfully added items to the database")
});

app.get("/", function(req, res) {

  res.render("list", {listTitle: "Today", newListItems: items});

});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
