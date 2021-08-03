const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.listen(3000);

app.post("/",function(req,res){
    var num1 = Number(req.body.num1);
    var num2 = Number(req.body.num2);
    var result = num1 + num2;
    res.send("Calculated sum of given numbers is "+result);
});
app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html")
});

app.post("/bmicalculator",function(req,res){
    var height = Number(req.body.height);
    var weight = Number(req.body.weight);
    var bmi = weight/(height*height);
    res.send("Your BMI is "+bmi);
})

app.get("/bmicalculator",function(req,res){
    res.sendFile(__dirname+"/bmiCalculator.html");
});