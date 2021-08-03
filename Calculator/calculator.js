const express = require("express");
const app = express();
app.listen(3000);

app.get("/",function(req,res){
    res.send("Hello, this is a calculator");
});