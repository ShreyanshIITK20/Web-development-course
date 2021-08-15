//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");                                               //importing mongoose

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});    //connecting mongoose to port 27017

const itemsSchema = {                                                               //format or schema of the list we are creating
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

const listSchema = {                                                                //schema of dynamic list which contains name of list and list contents in the same format as created in list schema
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List",listSchema);                                     //creating list model with list schema

app.get("/", function(req, res) {

  Item.find({},function(err,foundItems){                                            //{} signifies that we are finding everything inside the array and foundItems is the name given to the result of our operation, which will be logged on screen
    if(foundItems.length===0){                                                      //this helps in preventing adding items to database everytime we re-run our server, it will only add items when array length = 0 (empty)
      Item.insertMany(defaultItems,function(err){                                   //inserted the default item array in our Item collection
        if(err) console.log(err);
        else console.log("Successfully added items to the database")
      });
      res.redirect("/");                                                            //Now after adding items to database it will redirct to home directory and will now move to else block to actually render the array
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});             //render list.ejs and pass on the foundItems result to the array which shows different to-do items in ejs file
    }
    
  });


});

app.get("/:customListName",function(req,res){                                      //creating a dynamic list route with express's params feature
  const customListName = req.params.customListName;

  List.findOne({name:customListName},function(err,foundList){                       //this returns a single object in return if its found where as .find returns the array of found items. IT is used to find whether we have the following list created earlier or not
    if(!err){
      if(!foundList){                                                               //create a new list
        const list = new List({
          name : customListName,
          items : defaultItems
        });
      
        list.save();
        res.redirect("/"+customListName);                                             //to redirect to the new dynamic webpage with a new list we just saved into our database
      }
      else{                                                                         //open an existing list
        res.render("list",{listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });

})



app.post("/", function(req, res){

  const itemName = req.body.newItem;                                               //retrieve the input from ejs file using a form and saving it inside a const
  const listName = req.body.listTitle;                                             //stores the value of the list name in which we want our newly added item to get added, we retrive this from the value attribute in the submit button
  
  const item = new Item ({                                                         //created new record with the user input inside the Items collection
    name : itemName
  });

  if(listName==="Today"){                                                            //if the list is our Today's list then redirect to home route
    item.save();                                                                     //saving the record inside our collection
    res.redirect("/");                                                               //redirecting to home route so that newly formed list can be rendered there by entering else block
  }
  else {                                                                             //else we will have to redirect to the dynamic route we made 
    List.findOne({name:listName},function(err,foundList){                            //find the custom list and find the added item in that custom list
      foundList.items.push(item);                                                    //appending the items list with the new item we created just above
      foundList.save();
      res.redirect("/"+listName);
    });
  }

  });

app.post("/delete",function(req,res){
  const checkecItemID = req.body.checkbox;

  Item.findByIdAndRemove(checkecItemID,function(err){                              //selectively removes the checked item from the database
    if(!err) console.log("Successfully deleted the checked item");
    res.redirect("/");                                                             //redirecting to home route to see the changed webpage with deleted item
  });

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