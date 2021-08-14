const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/fruitsDB", {useNewUrlParser:true});         //connecting to port 27017 where our database will be hosted

const fruitSchema = new mongoose.Schema({           //creating schema for our collection to be constructed inside fruitDB
    name : String,                                  //JS objects that will make columns of our collection
    rating : Number,
    review : String
});

const Fruit = mongoose.model("Fruit",fruitSchema);      //create collection with name Fruit, where each record is a fruit (mind the spelling difference), and specified schema as set above

const fruit = new Fruit({                               //creating a record 'fruit' inside the collection 'Fruit'
    name : "Apple",
    rating : 7,
    review : "An apple a day keeps doctor away!"
});

//fruit.save();       //used to save our fruit record inside our Fruit collection, inside the fruitDB

const kiwi = new Fruit({                               //creating a record 'kiwi' inside the collection 'Fruit'
    name : "Kiwi",
    rating : 10,
    review : "Kiwis are green and tasty"
});

const banana = new Fruit({                               //creating a record 'banana' inside the collection 'Fruit'
    name : "Banana",
    rating : 8,
    review : "Elephants love it and so they are so strong"
});

const orange = new Fruit({                               //creating a record 'orange' inside the collection 'Fruit'
    name : "Orange",
    rating : 9,
    review : "Juicy but sour"
});

Fruit.insertMany([kiwi,banana,orange],function(err){        //to insert all the above newly added records to our collection. First argument is array of records to be added, and second is a callback function which recognises error messages and console logs accordingly.
    if(err){
        console.log(err);
    } else {
        console.log("Successfully saved all the fruits in FruitsDB");
    }
});