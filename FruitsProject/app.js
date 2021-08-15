const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/fruitsDB", {useNewUrlParser:true});         //connecting to port 27017 where our database will be hosted

const fruitSchema = new mongoose.Schema({           //creating schema for our collection to be constructed inside fruitDB
    name : {                                        //JS objects that will make columns of our collection
        type : String,
        required : [true,"Please check your data entry, no name specified!!"]        //built in validator to compulsorily accept the value in this field, this column cant be left empty
    },                                  
    rating : {
        type : Number,
        min : 1,                                    //built in validator to check the value entered in this field. If it doesnt satisfy these conditions then that input wont be accepted
        max : 10
    },
    review : String
});

const personSchema = new mongoose.Schema({
    name : String,
    age : Number,
    favouriteFruit : fruitSchema                    //establishing relationship between person and his favourite fruit which will contain info from the fruits collection
})

const Person = mongoose.model("Person",personSchema);

const Fruit = mongoose.model("Fruit",fruitSchema);      //create collection with name Fruit, where each record is a fruit (mind the spelling difference), and specified schema as set above

const fruit = new Fruit({                               //creating a record 'fruit' inside the collection 'Fruit'
    
    rating : 9,
    review : "Peaches are so yummy!"
});

const pineapple = new Fruit({
    name : "Pineapple",
    rating : 9,
    review : "Its a great fruit!"
});

//pineapple.save();

const person = new Person({                         //creating a person's record with her fav fruit being pineapple
    name : "John",
    age : 38,
    favouriteFruit : pineapple
});

//person.save();

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

// Fruit.insertMany([kiwi,banana,orange],function(err){        //to insert all the above newly added records to our collection. First argument is array of records to be added, and second is a callback function which recognises error messages and console logs accordingly.
//     if(err){
//         console.log(err);
//     } else {
//         console.log("Successfully saved all the fruits in FruitsDB");
//     }
// });

//We are commenting out the saving commands so that whenever we run our node app.js we dont recreate same records in the database

Fruit.find(function(err,fruits){            //call find function on collection Fruit, which will either return error or fruits records
    if(err){
        console.log(err);
    } else {

        mongoose.connection.close();        //closing the connection after successfully completing the last task

        fruits.forEach(function(fruit){     //console logging only names of every fruit inside the fruits collection (which is an array)
            console.log(fruit.name);
        })
    }
});

// Fruit.updateOne({_id:"6118d4008e43f73f8c5502da"},{name:"Peach"},function(err){       //updating a particular record
//     if(err) console.log(err);
//     else console.log("Successfully updated");
// })

// Fruit.updateOne({_id:"6118d45a03d625368c6a17e9"},{name:"Melons",review:"Melons are so big"},function(err){
//     if(err) console.log(err);
//     else console.log("Successfully updated");
// })

// Fruit.deleteOne({_id:"6118d45a03d625368c6a17e9"},function(err){                      //Deleted entry
//     if(err) console.log(err);
//     else console.log("Successfully updated");
// });

// Fruit.deleteOne({_id:"611846559b0ebd4b74068213"},function(err){                      //Deleted entry
//     if(err) console.log(err);
//     else console.log("Successfully updated");
// });